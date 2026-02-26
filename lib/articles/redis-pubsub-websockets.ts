import type { Block } from "../blocks";

export const content: Block[] = [
  {
    type: "callout",
    variant: "insight",
    text: "Redis Pub/Sub and WebSockets are not competing technologies. They solve different problems in the same pipeline. Confusing them is how you end up with an architecture that doesn't scale.",
  },
  {
    type: "paragraph",
    text: "ScrollOS is a real-time email newsletter OS. When new newsletters arrive, they appear in the user's feed instantly — no refresh, no polling. Under the hood, this requires two pieces working together: Redis Pub/Sub for server-to-server messaging, and WebSockets for server-to-client delivery.",
  },
  {
    type: "paragraph",
    text: "I've shipped both of these in production. I've also made the classic mistake of reaching for WebSockets when I should have used Pub/Sub, and vice versa. This is the mental model I use now, with the production architecture that gets you 40% better throughput than the naive approach.",
  },
  {
    type: "h2",
    text: "The Core Mental Model",
  },
  {
    type: "paragraph",
    text: "Start here, everything else follows from this:",
  },
  {
    type: "list",
    items: [
      "WebSocket: a persistent, bidirectional connection between a browser client and a server. Used for server → client push. Your browser holds this open.",
      "Redis Pub/Sub: a message broker that decouples producers from consumers on the server side. Used for server → server messaging. Your Node.js processes use this.",
    ],
  },
  {
    type: "paragraph",
    text: "The confusion: people treat WebSockets as a message broker. They're not — they're transport. A WebSocket connection is point-to-point (one server, one client). If you run multiple server instances (horizontal scaling), a message published on Server A cannot reach clients connected to Server B... unless you add a broker in between.",
  },
  {
    type: "callout",
    variant: "warning",
    text: "This is the horizontal scaling trap: you ship a real-time feature with WebSockets, it works perfectly in development (one server), then breaks in production (multiple servers) because messages only reach clients connected to the same instance that produced the event.",
  },
  {
    type: "h2",
    text: "The ScrollOS Architecture",
  },
  {
    type: "paragraph",
    text: "Here's what the full pipeline looks like:",
  },
  {
    type: "code",
    language: "text",
    code: `Gmail/Outlook API → Webhook Handler → Email Processor → Redis Pub/Sub
                                                               ↓
                                                      All WebSocket Servers
                                                               ↓
                                                      Connected Browsers`,
  },
  {
    type: "paragraph",
    text: "When a new newsletter arrives: the Gmail webhook fires, the handler processes it, and publishes an event to Redis. All WebSocket server instances subscribe to Redis — each one receives the event and fans it out to clients connected to that instance. Every user gets their update regardless of which server they're connected to.",
  },
  {
    type: "h2",
    text: "Redis Pub/Sub: The Server-Side Broker",
  },
  {
    type: "code",
    language: "typescript",
    filename: "redis-pubsub.ts",
    code: `import { createClient, type RedisClientType } from "redis";

// Pub/Sub requires separate clients for publishing and subscribing.
// A subscribing client enters a mode where it can only subscribe/unsubscribe.
let publisher: RedisClientType;
let subscriber: RedisClientType;

export async function initRedis() {
  const url = process.env.REDIS_URL;

  publisher = createClient({ url });
  subscriber = createClient({ url });

  await publisher.connect();
  await subscriber.connect();
}

// Channel naming convention: user-specific channels
// Scoped by userId so each user only receives their own events
function getUserChannel(userId: string): string {
  return \`user:\${userId}:newsletters\`;
}

// Publisher: called when a new newsletter is processed
export async function publishNewsletter(userId: string, newsletter: Newsletter) {
  const channel = getUserChannel(userId);
  const payload = JSON.stringify({
    type: "new_newsletter",
    newsletter,
    timestamp: Date.now(),
  });

  await publisher.publish(channel, payload);
}

// Subscriber: called once per WebSocket server at startup
// The callback receives every message published to matching channels
export async function subscribeToUser(
  userId: string,
  onMessage: (payload: unknown) => void
) {
  const channel = getUserChannel(userId);

  await subscriber.subscribe(channel, (message) => {
    try {
      const parsed = JSON.parse(message);
      onMessage(parsed);
    } catch {
      console.error("Failed to parse Redis message:", message);
    }
  });

  return () => subscriber.unsubscribe(channel);
}`,
  },
  {
    type: "h2",
    text: "WebSocket Server: The Client-Side Transport",
  },
  {
    type: "code",
    language: "typescript",
    filename: "websocket-server.ts",
    code: `import { WebSocketServer, WebSocket } from "ws";
import { subscribeToUser } from "./redis-pubsub";
import { verifyAuthToken } from "./auth";

// Map: userId → Set of connected WebSocket clients
// A user might have multiple tabs open — broadcast to all
const userConnections = new Map<string, Set<WebSocket>>();

export function createWebSocketServer(httpServer: HTTPServer) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", async (ws, req) => {
    // Authenticate via token in query string
    const url = new URL(req.url!, \`http://\${req.headers.host}\`);
    const token = url.searchParams.get("token");

    let userId: string;
    try {
      userId = await verifyAuthToken(token);
    } catch {
      ws.close(4001, "Unauthorized");
      return;
    }

    // Register this connection
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
    }
    userConnections.get(userId)!.add(ws);

    // Subscribe to Redis for this user's events
    // Only subscribe once per userId (not once per connection)
    const isFirstConnection = userConnections.get(userId)!.size === 1;
    let unsubscribe: (() => Promise<void>) | undefined;

    if (isFirstConnection) {
      unsubscribe = await subscribeToUser(userId, (payload) => {
        broadcast(userId, payload);
      });
    }

    ws.on("close", async () => {
      userConnections.get(userId)?.delete(ws);

      // Unsubscribe from Redis when user has no more connections
      if (userConnections.get(userId)?.size === 0) {
        userConnections.delete(userId);
        await unsubscribe?.();
      }
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: "connected", userId }));
  });

  return wss;
}

function broadcast(userId: string, payload: unknown) {
  const connections = userConnections.get(userId);
  if (!connections || connections.size === 0) return;

  const message = JSON.stringify(payload);
  for (const ws of connections) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }
}`,
  },
  {
    type: "h2",
    text: "Batched DB Writes: The 40% Throughput Win",
  },
  {
    type: "paragraph",
    text: "This is the optimization that surprised me most. The naive approach: write to the database every time you process a newsletter. With 1,000 newsletters per user sync, that's 1,000 individual INSERT statements.",
  },
  {
    type: "paragraph",
    text: "The fix: buffer newsletters in Redis and flush them to PostgreSQL in batches. 100 records per flush, flushed every 500ms or when the buffer fills, whichever comes first.",
  },
  {
    type: "code",
    language: "typescript",
    filename: "batch-writer.ts",
    code: `import { createClient } from "redis";
import { db } from "./database";

const BUFFER_KEY = "newsletter:write_buffer";
const BATCH_SIZE = 100;
const FLUSH_INTERVAL_MS = 500;

const redis = createClient({ url: process.env.REDIS_URL });

// Queue a newsletter for batch insertion
export async function queueNewsletter(newsletter: ProcessedNewsletter) {
  await redis.rPush(BUFFER_KEY, JSON.stringify(newsletter));
}

// Flush buffered newsletters to PostgreSQL
async function flush() {
  // Atomically get and clear up to BATCH_SIZE items
  // LMPOP is atomic — safe for multiple server instances
  const result = await redis.lmPop(1, BUFFER_KEY, "LEFT", { COUNT: BATCH_SIZE });
  if (!result || result.elements.length === 0) return;

  const newsletters = result.elements.map((el) =>
    JSON.parse(el.element) as ProcessedNewsletter
  );

  if (newsletters.length === 0) return;

  // Batch INSERT with ON CONFLICT DO NOTHING (idempotent)
  await db.query(\`
    INSERT INTO newsletters (id, user_id, subject, sender, category, received_at, preview)
    SELECT * FROM UNNEST($1::uuid[], $2::uuid[], $3::text[], $4::text[], $5::text[], $6::timestamptz[], $7::text[])
    ON CONFLICT (id) DO NOTHING
  \`, [
    newsletters.map(n => n.id),
    newsletters.map(n => n.userId),
    newsletters.map(n => n.subject),
    newsletters.map(n => n.sender),
    newsletters.map(n => n.category),
    newsletters.map(n => n.receivedAt),
    newsletters.map(n => n.preview),
  ]);

  console.log(\`Flushed \${newsletters.length} newsletters to DB\`);
}

// Start the flush loop
export function startBatchWriter() {
  setInterval(flush, FLUSH_INTERVAL_MS);
  redis.connect();
}`,
  },
  {
    type: "paragraph",
    text: "The PostgreSQL UNNEST trick is key here. Instead of 100 individual INSERT statements (100 round trips to the database), you're sending one statement with 100 rows (1 round trip). At 100 newsletters per batch, this reduces database round trips by 99%.",
  },
  {
    type: "metrics",
    items: [
      { label: "Throughput improvement", value: "+40%", description: "Newsletters processed/sec" },
      { label: "DB round trips", value: "−99%", description: "Per batch cycle" },
      { label: "Inbox sync time", value: "−45%", description: "For 1,000+ newsletter inboxes" },
      { label: "Redis Pub/Sub latency", value: "<5ms", description: "Server-to-server" },
    ],
  },
  {
    type: "h2",
    text: "Redis Pub/Sub Limitations to Know",
  },
  {
    type: "paragraph",
    text: "Redis Pub/Sub is not a message queue. This distinction matters:",
  },
  {
    type: "list",
    items: [
      "Fire-and-forget: if no subscribers are listening when you publish, the message is gone. Unlike Redis Streams or Kafka, there's no persistence.",
      "No delivery guarantees: if a subscriber crashes during delivery, the message is lost. For ScrollOS, this is acceptable — users will see the newsletter on next refresh. For financial transactions, use Redis Streams.",
      "Pattern subscriptions are expensive: PSUBSCRIBE with wildcards (user:*:newsletters) scans all channels on every publish. Prefer specific channel names over pattern subscriptions at scale.",
      "Redis connection limit: each subscriber connection uses one Redis connection. With 100 WebSocket server instances, you need 100 subscriber Redis connections. Plan your Redis instance size accordingly.",
    ],
  },
  {
    type: "h2",
    text: "When to Use Redis Streams Instead",
  },
  {
    type: "paragraph",
    text: "Redis Pub/Sub is the right choice when message loss is acceptable and you need low latency. Use Redis Streams when:",
  },
  {
    type: "list",
    items: [
      "You need message persistence (consumers can replay from an offset)",
      "You need consumer groups (multiple workers sharing a stream, each getting a subset of messages)",
      "You need delivery acknowledgment (XACK confirms processing)",
      "Messages must not be lost even if all consumers are temporarily offline",
    ],
  },
  {
    type: "paragraph",
    text: "For ScrollOS's notification flow, Pub/Sub is correct: if a user misses a real-time update (tab was closed), they'll see the newsletter when they next load the app. For the batch writer (queueNewsletter), we actually use a Redis List (RPUSH/LMPOP) rather than Pub/Sub, because we need persistence across server restarts.",
  },
  {
    type: "h2",
    text: "The Decision Flowchart",
  },
  {
    type: "list",
    items: [
      "Do you need to push data to a browser in real-time? → WebSocket (or SSE for one-way)",
      "Do you need to pass messages between server processes? → Redis Pub/Sub (if fire-and-forget is OK) or Redis Streams/Kafka (if you need persistence)",
      "Do you need to batch-write to a database efficiently? → Redis List as a buffer + UNNEST batch insert",
      "Do you need horizontal scaling for WebSocket servers? → Redis Pub/Sub as the fan-out layer between servers",
    ],
  },
  {
    type: "callout",
    variant: "insight",
    text: "The 40% throughput gain came entirely from the batched DB writes — not from Redis Pub/Sub itself. Redis Pub/Sub enables the architecture to scale horizontally. The batch writer makes each server instance more efficient. Both matter, but for different reasons.",
  },
];
