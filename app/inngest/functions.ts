import { openai } from "inngest";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    console.log("running hello world");
    await step.sleep("wait-a-moment", "1s");

    console.log("ran hello world");
    return { event, body: "Hello, World!" };
  }
);

export const multiStepSlow = inngest.createFunction(
  {
    id: "multistep-slow",
    retries: 0,
  },
  { event: "foo" },
  async ({ step }) => {
    await step.run("short-1", () => {});
    await step.sleep("zzz", "5m");
    await step.run("short-2", () => {});
  }
);

export const multiStepFast = inngest.createFunction(
  {
    id: "multistep-fast",
    retries: 0,
  },
  { event: "foo" },
  async ({ step }) => {
    await step.run("step-1", () => {});
    await step.sleep("3-milliseconds", "3");
    await step.run("step-2", () => {});
    await step.sleep("3-milliseconds", "3");
    await step.run("step-3", () => {});
    await step.sleep("3-milliseconds", "3");
    await step.run("step-4", () => {});
  }
);

export const multiStepSleepless = inngest.createFunction(
  {
    id: "multistep-sleepless",
    retries: 0,
  },
  { event: "foo" },
  async ({ step }) => {
    await step.run("step-1", () => {});
    await step.run("step-2", () => {});
    await step.run("step-3", () => {});
    await step.run("step-4", () => {});
    await step.run("step-5", () => {});
    await step.run("step-6", () => {});
  }
);

export const parallelSteps = inngest.createFunction(
  {
    id: "multistep-parallel",
    retries: 0,
  },
  { event: "foo" },
  async ({ step }) => {
    await Promise.all([
      step.run("run", () => {}),
      step.sleep("sleep-1", "1s"),
      step.sleep("sleep-1", "1m"),
    ]);
  }
);

export const retrySteps = inngest.createFunction(
  {
    id: "multistep-retry",
  },
  { event: "foo" },
  async ({ step, attempt }) => {
    await step.sleep("sleep-1", "1s");

    await step.run("a", () => {
      if (attempt === 0) {
        throw new Error("no bueno");
      }
    });

    await step.sleep("sleep-1", "1m");
  }
);

export const aiInfer = inngest.createFunction(
  { id: "ai-infer-test" },
  { event: "ai/infer.test" },
  async ({ event, step }) => {
    console.log("running ai infer");
    const response = await step.ai.infer("inference", {
      provider: openai({
        apiKey: process.env.OPENAI_API_KEY,
        model: "chatgpt-4o-latest",
      }),
      body: {
        temperature: 0.9,
        messages: [
          {
            role: "user",
            content: "Give me a famous quote about friends and enemies.",
          },
        ],
      },
    });

    console.log("response", response);
    return { event, body: response };
  }
);
