import { deliverEnquiry } from "@/lib/deliver-enquiry";
import { normalise, validate } from "@/lib/enquiry";
import { rateLimit } from "@/lib/rate-limit";

const MAX_BODY = 12_000; // bytes

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  // same-origin only
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json({ ok: false, error: "forbidden" }, 403);

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "unsupported" }, 415);
  }

  const ip = (request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown").split(",")[0].trim();
  const limit = rateLimit(`enquiry:${ip}`);
  if (!limit.ok) return json({ ok: false, error: "rate-limited" }, 429, { "Retry-After": String(limit.retryAfter) });

  const text = await request.text();
  if (text.length > MAX_BODY) return json({ ok: false, error: "too-large" }, 413);

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  const input = normalise(raw);

  // bots: honeypot filled, or submitted faster than a person can type
  const age = input.startedAt ? Date.now() - input.startedAt : 0;
  if (input.companyWebsite || (input.startedAt && age < 2500)) return json({ ok: true });

  const errors = validate(input);
  if (Object.keys(errors).length) return json({ ok: false, error: "validation", errors }, 400);

  const result = await deliverEnquiry(input);
  if (!result.ok) return json({ ok: false, error: result.reason }, result.reason === "not-configured" ? 503 : 502);
  return json({ ok: true });
}

export function GET() {
  return json({ ok: false, error: "method-not-allowed" }, 405, { Allow: "POST" });
}
