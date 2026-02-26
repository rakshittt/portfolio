import type { Block } from "../blocks";

export const content: Block[] = [
  {
    type: "callout",
    variant: "warning",
    text: "If your pods are getting OOMKilled at 3am, it's probably limits. If your pods are mysteriously slow but not crashing, it's probably throttled CPU. These are completely different problems with completely different fixes.",
  },
  {
    type: "paragraph",
    text: "I've configured Kubernetes resource settings for a real-time video analytics system running at 60fps per stream, across 40+ streams, with a 99% uptime SLA. I've been OOMKilled. I've been throttled into oblivion. I've set limits too high and watched nodes go down. Here's what I wish someone had explained before I had to learn all of this through production incidents.",
  },
  {
    type: "paragraph",
    text: "The official Kubernetes docs explain what requests and limits do. They don't explain the failure modes, the gotchas, or the decision framework for real workloads. This post fills that gap.",
  },
  {
    type: "h2",
    text: "Requests vs Limits: The Mental Model That Actually Helps",
  },
  {
    type: "paragraph",
    text: "Here's the simplest accurate model: requests are promises to the scheduler; limits are ceilings enforced by the kubelet.",
  },
  {
    type: "list",
    items: [
      "CPU request: 'I need at least this much CPU.' The scheduler uses this to decide which node to place the pod on. The kubelet uses this to set the CFS (Completely Fair Scheduler) shares — a soft guarantee.",
      "CPU limit: 'I must never use more than this much CPU.' Enforced by cgroups. The pod gets throttled (slowed down, not killed) when it tries to exceed this.",
      "Memory request: Same as CPU — used by scheduler for node placement.",
      "Memory limit: 'If the container exceeds this, kill it.' Memory cannot be throttled — it either fits or the process is terminated with OOMKilled.",
    ],
  },
  {
    type: "callout",
    variant: "warning",
    text: "This asymmetry is the #1 source of confusion. CPU can be throttled (slow but alive). Memory cannot — exceed the limit and the container dies. This means you need a completely different strategy for each resource.",
  },
  {
    type: "h2",
    text: "The CPU Throttling Problem",
  },
  {
    type: "paragraph",
    text: "CPU throttling is invisible. Your pod doesn't crash. Your logs don't show errors. Your latency quietly doubles and you spend two hours debugging the wrong thing.",
  },
  {
    type: "paragraph",
    text: "This is what happened to our video processing pods. We had set CPU limits at 500m (0.5 cores) per pod. The pods ran fine under normal load. During burst processing (a crowd surge at an attraction), CPU demand spiked to 800m — 60% over the limit. Kubernetes throttled us. Frame processing latency went from 180ms to 320ms. The model wasn't slower. The frames weren't more complex. The scheduler was just refusing to give us CPU we needed.",
  },
  {
    type: "code",
    language: "bash",
    filename: "check_throttling.sh",
    code: `# Check CPU throttling percentage for a specific pod
kubectl exec -it <pod-name> -- cat /sys/fs/cgroup/cpu/cpu.stat

# Output:
# nr_periods 12534
# nr_throttled 4821
# throttled_time 9823741947

# Throttle percentage = nr_throttled / nr_periods
# In this case: 4821 / 12534 = 38.5% — this pod is throttled 38% of the time

# Better: use Prometheus if available
# container_cpu_cfs_throttled_seconds_total / container_cpu_cfs_periods_total`,
  },
  {
    type: "paragraph",
    text: "The fix for CPU throttling isn't always 'raise the limit.' Before raising limits, ask: is this burst actually needed, or is it a symptom of inefficient code? In our case, the answer was both — we fixed the code (the O(n²) issue described in the latency article) and raised the CPU limit to 1000m for burst headroom.",
  },
  {
    type: "h2",
    text: "The Memory OOMKill Problem",
  },
  {
    type: "paragraph",
    text: "OOMKill is less subtle. The pod dies. But the cause is often not what you think.",
  },
  {
    type: "paragraph",
    text: "Common mistake: setting memory limit equal to the working set size. Your code uses 512MB on average, so you set limit to 512Mi. This is wrong. At P99, memory usage might be 650MB — during a garbage collection pause, during model loading, during a traffic spike. When that happens: OOMKilled, restart, lose the in-progress frames.",
  },
  {
    type: "code",
    language: "yaml",
    filename: "pod-resources.yaml",
    code: `# Bad: limits too tight, requests too low
resources:
  requests:
    cpu: "100m"      # Way too low — pod gets scheduled on overloaded nodes
    memory: "256Mi"  # Way too low — scheduler thinks pod needs almost nothing
  limits:
    cpu: "500m"      # Too low — causes throttling during bursts
    memory: "512Mi"  # No headroom — will OOMKill at P95+ memory usage

---
# Better: sized for real workload with headroom
resources:
  requests:
    cpu: "400m"      # Actual P50 CPU usage (measured)
    memory: "512Mi"  # Actual P50 memory usage (measured)
  limits:
    cpu: "1200m"     # 3x request — allows bursting without throttling
    memory: "1024Mi" # 2x request — headroom for GC and spikes
    # Note: no CPU limit is also a valid choice for non-bursty workloads
    # (see QoS section below)`,
  },
  {
    type: "h2",
    text: "QoS Classes: What Kubernetes Does With Your Settings",
  },
  {
    type: "paragraph",
    text: "Kubernetes assigns one of three Quality of Service classes to each pod based on its resource settings. This directly affects eviction order when a node runs out of resources.",
  },
  {
    type: "list",
    ordered: true,
    items: [
      "Guaranteed: requests == limits for all containers, all resources. Kubernetes evicts these pods LAST. Use for critical production workloads.",
      "Burstable: some requests set, requests < limits. Evicted second. Use for most application workloads — you get burst capacity while maintaining scheduling predictability.",
      "BestEffort: no requests or limits set at all. Evicted FIRST. Never use for production.",
    ],
  },
  {
    type: "callout",
    variant: "info",
    text: "For our real-time video pipeline, we run Guaranteed QoS: requests == limits. We give up burst capacity in exchange for guaranteed resource availability and never being evicted. For a 99% uptime SLA, the predictability is worth it.",
  },
  {
    type: "h2",
    text: "How to Actually Measure Right-Sized Requests",
  },
  {
    type: "paragraph",
    text: "Don't guess. Profile. Here's the process I use:",
  },
  {
    type: "list",
    ordered: true,
    items: [
      "Run the workload under realistic load for at least 24 hours (capture daily patterns).",
      "Collect P50, P95, P99 CPU and memory metrics. Prometheus + Grafana or kubectl top.",
      "Set requests at P50 CPU and memory. This tells the scheduler the 'normal' resource need.",
      "Set limits at P99 + 20% headroom for memory. For CPU, set at P99 or remove limits entirely (see below).",
      "Run VPA (Vertical Pod Autoscaler) in recommendation mode for a week and compare its suggestions to yours.",
    ],
  },
  {
    type: "code",
    language: "bash",
    filename: "measure_resources.sh",
    code: `# Get CPU and memory stats for all pods in a namespace
kubectl top pods -n production --sort-by=cpu

# For detailed time-series, query Prometheus directly
# CPU P95 over 24h:
# histogram_quantile(0.95,
#   rate(container_cpu_usage_seconds_total{
#     namespace="production",
#     container="video-processor"
#   }[5m])
# )

# Memory P99 over 24h:
# histogram_quantile(0.99,
#   container_memory_working_set_bytes{
#     namespace="production",
#     container="video-processor"
#   }
# )

# Enable VPA in recommendation mode (does NOT change your pods)
kubectl apply -f - <<EOF
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: video-processor-vpa
  namespace: production
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: video-processor
  updatePolicy:
    updateMode: "Off"  # Recommendation only — won't auto-update
EOF

# Check VPA recommendations after 24h:
kubectl describe vpa video-processor-vpa -n production`,
  },
  {
    type: "h2",
    text: "The Case for No CPU Limits",
  },
  {
    type: "paragraph",
    text: "This is controversial: for CPU, there is a reasonable argument to set no limits at all. The reasoning: CPU is compressible — a pod running over its requested CPU just gets lower CPU shares, not killed. If the node has spare capacity, why throttle the pod?",
  },
  {
    type: "paragraph",
    text: "Netflix has published on this. The argument is that CPU throttling causes latency spikes that are worse than the alternative (other pods getting slightly less CPU on the same node). The counter-argument: if every pod can burst to any CPU level, a rogue pod can starve all others on the node.",
  },
  {
    type: "paragraph",
    text: "Our decision: we keep CPU limits for video processing pods because we need predictable per-stream latency. A single pod using 8 cores instead of 1 would starve 7 other streams on the same node. For non-latency-sensitive workloads (batch jobs, background workers), removing CPU limits is a reasonable choice.",
  },
  {
    type: "h2",
    text: "Real Configuration: What We Run",
  },
  {
    type: "code",
    language: "yaml",
    filename: "video-processor-deployment.yaml",
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: video-processor
  namespace: production
spec:
  replicas: 40
  selector:
    matchLabels:
      app: video-processor
  template:
    spec:
      containers:
        - name: video-processor
          image: gcr.io/project/video-processor:latest
          resources:
            requests:
              cpu: "800m"      # P50 usage measured over 7 days
              memory: "768Mi"  # P50 usage measured over 7 days
            limits:
              cpu: "800m"      # Equal to requests = Guaranteed QoS
              memory: "768Mi"  # Equal to requests = Guaranteed QoS

      # Node affinity: prefer nodes with SSD (faster frame I/O)
      affinity:
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 1
              preference:
                matchExpressions:
                  - key: cloud.google.com/gke-nodepool
                    operator: In
                    values: ["high-cpu-pool"]`,
  },
  {
    type: "h2",
    text: "The 3am Checklist",
  },
  {
    type: "paragraph",
    text: "When something goes wrong at 3am and you don't know if it's CPU or memory:",
  },
  {
    type: "list",
    items: [
      "kubectl get events -n production --sort-by=lastTimestamp — look for OOMKilling or BackOff",
      "kubectl top pods — is anything near its resource limits?",
      "Check throttle percentage in cgroup stats (see command above)",
      "kubectl describe pod <pod-name> — look at the LastState section for exit codes (137 = OOMKill, 1 = application crash)",
      "If OOMKill: raise memory limits temporarily, investigate memory leak separately",
      "If throttled: check if it's a burst (temporary) or sustained (need larger limit or code fix)",
    ],
  },
  {
    type: "callout",
    variant: "insight",
    text: "The most important thing I've learned: measure first, configure second. Every 'rule of thumb' for resource settings will be wrong for your specific workload. Profile it. The 30 minutes you spend profiling will save you 10 hours of incident response.",
  },
  {
    type: "h2",
    text: "Summary: The Decision Framework",
  },
  {
    type: "list",
    items: [
      "Set requests based on P50 measured usage — this is what the scheduler uses to place your pod.",
      "Set memory limits at P99 + 20% — OOMKills are hard restarts, always give headroom.",
      "For CPU limits: use Guaranteed QoS (limits == requests) for latency-sensitive workloads; consider removing limits for batch workloads.",
      "Use VPA in recommendation mode to validate your settings after a week of production traffic.",
      "Add Prometheus alerts for CPU throttle percentage > 10% and memory usage > 85% of limit. These are your early warning system.",
    ],
  },
];
