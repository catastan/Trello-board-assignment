"use client";

import posthog from "posthog-js";

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key) return; // no-op if not configured

  posthog.init(key, {
    api_host: host || "https://app.posthog.com",
    capture_pageview: true,
  });

  initialized = true;
}

export function track(event: string, props?: Record<string, any>) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return; // no-op if not configured
  posthog.capture(event, props);
}
