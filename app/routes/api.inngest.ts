// app/routes/api.inngest.ts
import { serve } from "inngest/remix";
import { inngest } from "~/inngest/client";
import { aiInfer, helloWorld } from "~/inngest/functions";

const handler = serve({
  client: inngest,
  functions: [helloWorld, aiInfer],
});

export { handler as action, handler as loader };
