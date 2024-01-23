import { env } from "@/env/client.mjs";
import { PostHog } from "posthog-node";

const posthog = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  host: env.NEXT_PUBLIC_POSTHOG_API_HOST,
});
export default posthog;
