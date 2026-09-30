import type { MetadataRoute } from "next";

// Crawlers that collect content to train AI models.
const TRAINING = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
  "cohere-ai",
  "Diffbot",
];

// AI search indexers and "someone pasted your link into a chatbot" fetchers.
// Blocking these also keeps you out of AI answers about you.
const SEARCH_AND_FETCH = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "Claude-Web",
  "PerplexityBot",
  "Perplexity-User",
];

// Set to false to block training only and stay visible in AI search/answers.
const BLOCK_AI_SEARCH_AND_FETCH = false;

export default function robots(): MetadataRoute.Robots {
  const blocked = BLOCK_AI_SEARCH_AND_FETCH
    ? [...TRAINING, ...SEARCH_AND_FETCH]
    : TRAINING;

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: blocked, disallow: "/" },
    ],
  };
}