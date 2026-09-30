import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Optional hard block: refuses requests whose User-Agent names a known AI bot.
// (Google-Extended and Applebot-Extended are robots.txt-only tokens and never
// appear as a User-Agent, so they are not listed here.)
const AI_BOTS =
  /(GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Bytespider|Amazonbot|meta-externalagent|cohere-ai|Diffbot)/i;

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (AI_BOTS.test(ua)) {
    return new NextResponse("Automated AI access is not permitted.", {
      status: 403,
    });
  }
  return NextResponse.next();
}

// Skip static assets and robots.txt (bots must still be able to read it).
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};