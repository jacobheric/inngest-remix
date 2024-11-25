// app/routes/api.inngest.ts
import { serve } from "inngest/remix";
import { inngest } from "~/inngest/client";
import { aiInfer, helloWorld } from "~/inngest/functions";

const handler = serve({
  client: inngest,
  functions: [aiInfer, helloWorld],
});

export { handler as action, handler as loader };
