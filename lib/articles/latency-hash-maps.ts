import type { Block } from "../blocks";

export const content: Block[] = [
  {
    type: "callout",
    variant: "insight",
    text: "800ms → 400ms. No new hardware. No algorithmic breakthrough. Just better data structures and a profiler that didn't lie to us.",
  },
  {
    type: "paragraph",
    text: "The system monitors real-time crowd safety at theme park attractions — detecting anomalies in live video streams, triggering alerts before incidents escalate. It processes 60+ frames per second per camera across dozens of streams simultaneously. When latency crept from 400ms to 800ms over three months, the client noticed before we did. That's the worst way to find out.",
  },
  {
    type: "paragraph",
    text: "This is the full post-mortem: what we profiled, what we found, what we changed, and why it worked. I'm going to be specific about the data structures because that's the actual story — not the infrastructure, not the ML model, not the cloud configuration. The model hadn't changed. The hardware hadn't changed. The code had accumulated two features and three bug fixes. That was enough.",
  },
  {
    type: "h2",
    text: "The System Architecture (Brief Version)",
  },
  {
    type: "paragraph",
    text: "Each camera stream feeds into a Python asyncio worker. The worker receives frames from a Kafka consumer, preprocesses them (resize, normalize, annotate zone metadata), runs inference via a local model server, post-processes detections (apply zone rules, deduplicate, score), and emits events to a Redis stream. Alerts flow downstream from there.",
  },
  {
    type: "metrics",
    items: [
      { label: "Streams active", value: "40+", description: "Simultaneous camera feeds" },
      { label: "Frames/sec/stream", value: "60", description: "Processing target" },
      { label: "Alert latency (before)", value: "800ms", description: "P95 end-to-end" },
      { label: "Alert latency (after)", value: "400ms", description: "P95 end-to-end" },
    ],
  },
  {
    type: "paragraph",
    text: "The 800ms number was P95. The P50 was closer to 500ms. But theme park operations care about the tail — that's where real incidents live. A slow alert on the median case is annoying. A slow alert on the worst case is a liability.",
  },
  {
    type: "h2",
    text: "Step 1: Profile First, Guess Never",
  },
  {
    type: "paragraph",
    text: "The team's first instinct was the model server. Inference is the most computationally expensive step — if anything got slower, it was probably that. I've seen this pattern before: blame the expensive thing, miss the cheap thing that runs 60 times per second.",
  },
  {
    type: "paragraph",
    text: "We instrumented every stage with high-resolution timestamps using Python's time.perf_counter_ns() — not time.time(), which has millisecond granularity on some platforms. Then we ran the profiler across 10,000 frames from a replay of live traffic.",
  },
  {
    type: "code",
    language: "python",
    filename: "profiler.py",
    code: `import time
import asyncio
from dataclasses import dataclass, field
from typing import Dict, List

@dataclass
class StageTimer:
    name: str
    samples: List[float] = field(default_factory=list)

    def record(self, duration_ns: float):
        self.samples.append(duration_ns / 1_000_000)  # to ms

    @property
    def p95(self) -> float:
        if not self.samples:
            return 0.0
        sorted_s = sorted(self.samples)
        idx = int(len(sorted_s) * 0.95)
        return sorted_s[idx]

    @property
    def mean(self) -> float:
        return sum(self.samples) / len(self.samples) if self.samples else 0.0

timers: Dict[str, StageTimer] = {}

def get_timer(name: str) -> StageTimer:
    if name not in timers:
        timers[name] = StageTimer(name)
    return timers[name]

async def process_frame(frame, zone_config):
    t0 = time.perf_counter_ns()

    preprocessed = preprocess(frame, zone_config)
    t1 = time.perf_counter_ns()
    get_timer("preprocess").record(t1 - t0)

    detections = await run_inference(preprocessed)
    t2 = time.perf_counter_ns()
    get_timer("inference").record(t2 - t1)

    events = post_process(detections, zone_config)
    t3 = time.perf_counter_ns()
    get_timer("post_process").record(t3 - t2)

    await emit_events(events)
    t4 = time.perf_counter_ns()
    get_timer("emit").record(t4 - t3)`,
  },
  {
    type: "paragraph",
    text: "The results were not what anyone expected:",
  },
  {
    type: "list",
    items: [
      "preprocess: P95 = 4.2ms (fine)",
      "inference: P95 = 180ms (fine — this is the model, expected)",
      "post_process: P95 = 380ms (not fine — this was 40ms three months ago)",
      "emit: P95 = 12ms (fine)",
    ],
  },
  {
    type: "callout",
    variant: "warning",
    text: "Post-processing had grown from 40ms to 380ms — nearly 10x slower — while inference stayed constant. Two features had landed in post_process in the past three months.",
  },
  {
    type: "h2",
    text: "The Root Cause: O(n²) Hiding in Plain Sight",
  },
  {
    type: "paragraph",
    text: "Post-processing does three things: it maps each detection to its zone, deduplicates detections across overlapping camera regions, and scores severity based on zone rules. When the system launched, each frame had maybe 8–12 detections. By the time we were profiling, zones had been expanded and detection sensitivity had been tuned up — some frames had 150–200 detections.",
  },
  {
    type: "paragraph",
    text: "The zone mapping code looked like this (simplified to the relevant logic):",
  },
  {
    type: "code",
    language: "python",
    filename: "post_process_before.py",
    code: `def map_detections_to_zones(detections, zone_config):
    """
    For each detection, find which zone it belongs to.
    zone_config.zones is a list of Zone objects.
    """
    mapped = []
    for detection in detections:
        detection_zone = None
        for zone in zone_config.zones:
            if zone.contains(detection.centroid):
                detection_zone = zone.id
                break
        if detection_zone:
            mapped.append({**detection.__dict__, "zone_id": detection_zone})
    return mapped

def deduplicate_detections(mapped_detections, camera_overlap_pairs):
    """
    Remove duplicate detections from overlapping camera regions.
    camera_overlap_pairs: list of (cam_a_id, cam_b_id) tuples
    """
    to_remove = set()
    for i, det_a in enumerate(mapped_detections):
        for j, det_b in enumerate(mapped_detections):
            if i == j:
                continue
            # Check if these cameras have overlap
            is_overlapping = False
            for pair in camera_overlap_pairs:
                if (det_a["camera_id"], det_b["camera_id"]) in [pair, pair[::-1]]:
                    is_overlapping = True
                    break
            if is_overlapping and iou(det_a, det_b) > 0.5:
                # Keep the higher-confidence detection
                if det_a["confidence"] < det_b["confidence"]:
                    to_remove.add(i)
    return [d for i, d in enumerate(mapped_detections) if i not in to_remove]`,
  },
  {
    type: "paragraph",
    text: "Do you see it? The outer loop iterates over detections (up to 200). The inner loop also iterates over detections. The overlap check iterates over camera_overlap_pairs. In the worst case, with 200 detections and 30 camera pairs, this is 200 × 200 × 30 = 1,200,000 iterations per frame. At 60 frames per second. Per stream.",
  },
  {
    type: "callout",
    variant: "warning",
    text: "1.2 million iterations × 60 frames/sec × 40 streams = 2.88 billion loop iterations per second. The CPython interpreter costs roughly 50–100ns per iteration. Do the math.",
  },
  {
    type: "h2",
    text: "Fix 1: Replace Zone Lookup with a Hash Map",
  },
  {
    type: "paragraph",
    text: "Zone mapping was O(d × z) where d = detections and z = zones. The fix: precompute a spatial hash. We divide the frame into a grid and precompute which zone each grid cell belongs to. Detection centroid → grid cell → zone ID. O(1) lookup.",
  },
  {
    type: "code",
    language: "python",
    filename: "zone_index.py",
    code: `from typing import Dict, Optional, Tuple
import numpy as np

class ZoneSpatialIndex:
    """
    Precomputes a grid-based spatial index for O(1) zone lookups.
    Grid resolution is configurable — 32x32 is a good default for
    1920x1080 frames (60x33.75 pixels per cell).
    """
    def __init__(self, zones, frame_width: int, frame_height: int, grid_size: int = 32):
        self.grid_size = grid_size
        self.frame_width = frame_width
        self.frame_height = frame_height
        self.cell_w = frame_width / grid_size
        self.cell_h = frame_height / grid_size

        # Build the lookup grid: grid[row][col] = zone_id or None
        self.grid: Dict[Tuple[int, int], Optional[str]] = {}

        for row in range(grid_size):
            for col in range(grid_size):
                # Cell center point
                cx = (col + 0.5) * self.cell_w
                cy = (row + 0.5) * self.cell_h
                cell_zone = None
                for zone in zones:
                    if zone.contains((cx, cy)):
                        cell_zone = zone.id
                        break
                self.grid[(row, col)] = cell_zone

    def lookup(self, centroid: Tuple[float, float]) -> Optional[str]:
        """O(1) zone lookup for a given point."""
        col = min(int(centroid[0] / self.cell_w), self.grid_size - 1)
        row = min(int(centroid[1] / self.cell_h), self.grid_size - 1)
        return self.grid.get((row, col))


# Usage — build once at startup, reuse for every frame
zone_index = ZoneSpatialIndex(zone_config.zones, frame_width=1920, frame_height=1080)

def map_detections_to_zones_fast(detections, zone_index: ZoneSpatialIndex):
    mapped = []
    for detection in detections:
        zone_id = zone_index.lookup(detection.centroid)
        if zone_id:
            mapped.append({**detection.__dict__, "zone_id": zone_id})
    return mapped`,
  },
  {
    type: "paragraph",
    text: "Zone mapping dropped from O(d × z) to O(d). The grid is built once at startup and shared across all frames. With 200 detections and 32×32 grid: 200 dictionary lookups instead of 200 × 15 zone.contains() calls.",
  },
  {
    type: "h2",
    text: "Fix 2: Replace the Deduplication Loop with a Hash-Keyed Structure",
  },
  {
    type: "paragraph",
    text: "The O(n²) deduplication was the bigger culprit. The fix: index detections by camera_id first, then only compare detections from cameras that are known to overlap. Precompute the overlap pairs into a set for O(1) lookup.",
  },
  {
    type: "code",
    language: "python",
    filename: "dedup_fast.py",
    code: `from collections import defaultdict
from typing import Dict, List, Set, Tuple

def build_overlap_set(camera_overlap_pairs) -> Set[Tuple[str, str]]:
    """
    Precompute overlap pairs as a frozenset-keyed set for O(1) lookup.
    Call this once at startup, not per-frame.
    """
    overlap_set = set()
    for cam_a, cam_b in camera_overlap_pairs:
        # Store both orderings so lookup is order-independent
        overlap_set.add((cam_a, cam_b))
        overlap_set.add((cam_b, cam_a))
    return overlap_set

def deduplicate_detections_fast(
    mapped_detections: List[dict],
    overlap_set: Set[Tuple[str, str]],
) -> List[dict]:
    """
    O(d * k) where k = average detections per overlapping camera pair.
    For typical scenes k << d, making this near-linear in practice.
    """
    # Group detections by camera
    by_camera: Dict[str, List[Tuple[int, dict]]] = defaultdict(list)
    for i, det in enumerate(mapped_detections):
        by_camera[det["camera_id"]].append((i, det))

    to_remove: Set[int] = set()

    # Only compare detections from cameras that overlap
    cameras = list(by_camera.keys())
    for idx_a, cam_a in enumerate(cameras):
        for cam_b in cameras[idx_a + 1:]:
            if (cam_a, cam_b) not in overlap_set:
                continue
            # Compare only detections from these two cameras
            for i, det_a in by_camera[cam_a]:
                if i in to_remove:
                    continue
                for j, det_b in by_camera[cam_b]:
                    if j in to_remove:
                        continue
                    if iou(det_a, det_b) > 0.5:
                        # Remove lower-confidence detection
                        if det_a["confidence"] < det_b["confidence"]:
                            to_remove.add(i)
                        else:
                            to_remove.add(j)

    return [d for i, d in enumerate(mapped_detections) if i not in to_remove]`,
  },
  {
    type: "paragraph",
    text: "In our setup, only 8 of the 40 cameras had overlapping coverage. The new code only compares detections from those 8 cameras against each other — skipping 80% of the pairwise comparisons entirely. The overlap_set lookup is O(1) per pair.",
  },
  {
    type: "h2",
    text: "Fix 3: Priority Queue for Frame Scheduling",
  },
  {
    type: "paragraph",
    text: "This one was less obvious. Our asyncio workers processed frames in strict FIFO order from the Kafka consumer. In high-load conditions, this meant a burst of low-priority frames (empty zones, no detections) could block high-priority frames (crowded zones) from being processed. We weren't missing the deadline — we were processing the wrong thing first.",
  },
  {
    type: "paragraph",
    text: "The fix: classify frames immediately after preprocessing (before inference) and route them into a priority queue based on zone occupancy score. High-occupancy frames get processed first.",
  },
  {
    type: "code",
    language: "python",
    filename: "priority_queue.py",
    code: `import asyncio
import heapq
from dataclasses import dataclass, field
from typing import Any

@dataclass(order=True)
class PrioritizedFrame:
    priority: int           # Lower = higher priority (min-heap)
    timestamp: float        # Secondary sort: FIFO within same priority
    frame: Any = field(compare=False)
    preprocessed: Any = field(compare=False)

class PriorityFrameQueue:
    def __init__(self):
        self._heap = []
        self._lock = asyncio.Lock()

    async def push(self, frame, preprocessed, zone_occupancy_score: float):
        # Invert score: high occupancy = low priority value = processed first
        priority = int((1.0 - zone_occupancy_score) * 100)
        item = PrioritizedFrame(
            priority=priority,
            timestamp=frame.timestamp,
            frame=frame,
            preprocessed=preprocessed,
        )
        async with self._lock:
            heapq.heappush(self._heap, item)

    async def pop(self) -> PrioritizedFrame:
        async with self._lock:
            if not self._heap:
                return None
            return heapq.heappop(self._heap)

def estimate_zone_occupancy(preprocessed_frame, zone_index: ZoneSpatialIndex) -> float:
    """
    Fast heuristic: sample pixel intensity variance in known high-risk zones.
    High variance = more motion = higher occupancy estimate.
    Not perfect — but computed in <1ms, good enough for scheduling.
    """
    if not zone_index.high_risk_cells:
        return 0.5  # default mid-priority

    region = preprocessed_frame[zone_index.high_risk_region]
    variance = float(region.var())
    # Normalize to 0-1 range based on empirical thresholds
    return min(variance / 500.0, 1.0)`,
  },
  {
    type: "paragraph",
    text: "The occupancy estimation is intentionally cheap — it runs before inference. We're not detecting anything; we're just asking \"does this frame look like it has a lot of motion in the high-risk zones?\" A simple variance calculation on a small region runs in under a millisecond.",
  },
  {
    type: "h2",
    text: "Results After All Three Fixes",
  },
  {
    type: "metrics",
    items: [
      { label: "P95 latency (before)", value: "800ms", description: "Across all streams" },
      { label: "P95 latency (after)", value: "400ms", description: "Exactly 50% reduction" },
      { label: "Post-process time", value: "28ms", description: "Down from 380ms P95" },
      { label: "CPU usage", value: "−22%", description: "Aggregate reduction" },
    ],
  },
  {
    type: "paragraph",
    text: "The post-process stage went from 380ms P95 to 28ms P95 — a 13x improvement on that stage alone. The priority queue contributed an additional 30–40ms reduction on P95 by ensuring high-risk frames aren't starved behind empty-zone frames during bursts.",
  },
  {
    type: "h2",
    text: "What I'd Do Differently",
  },
  {
    type: "list",
    items: [
      "Profile from day one. Not constantly — but at feature boundaries. Every time something lands in post_process, run the profiler. The bug wasn't a sudden change; it was a gradual accumulation that became obvious only at 10x the original detection count.",
      "Don't trust the obvious bottleneck. Inference was the most expensive step by clock time. It wasn't the problem. The problem was the O(n²) step that ran after it.",
      "Precompute anything that's static. Zone configs, camera overlap pairs, spatial indexes — these don't change frame to frame. Build them once at startup, not 60 times per second per stream.",
      "Log percentiles, not averages. Our internal dashboards showed average latency. The average looked fine. P95 was the number that told the truth. Add P95 and P99 to every latency dashboard from the start.",
    ],
  },
  {
    type: "h2",
    text: "The Broader Lesson",
  },
  {
    type: "paragraph",
    text: "Data structures courses teach you about Big-O in the abstract. Production systems teach you that Big-O only matters when n gets large — and n always gets larger. The zone lookup was O(d × z) with d=12 and z=8 when it was written. That's 96 iterations. Totally fine. Three months later with d=200 and z=15: 3,000 iterations. Per frame. At 60fps. For 40 streams.",
  },
  {
    type: "paragraph",
    text: "The code wasn't wrong when it was written. It became wrong as the system grew. The only defense is a profiler and the discipline to run it before the client notices.",
  },
  {
    type: "callout",
    variant: "insight",
    text: "The best performance optimizations I've made weren't clever. They were just: profile, find the hot path, replace the loop with a hash map, repeat. The insight is always obvious in hindsight. Run the profiler before you need to.",
  },
];
