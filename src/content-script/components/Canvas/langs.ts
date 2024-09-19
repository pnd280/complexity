// this constant is shared between main world and content script context, so it shouldn't be in a tsx file
// https://github.com/vitejs/vite-plugin-react/issues/11#discussion_r430879201

import { toast } from "@/shared/toast";
import { CanvasLangSetting } from "@/utils/Canvas";
import { whereAmI } from "@/utils/utils";
import WsMessageParser from "@/utils/WsMessageParser";

export const canvasLangSettings = [
  {
    title: "Charts & Diagrams",
    pplxSearch: "Mermaid Diagramming and charting tool",
    trigger: "mermaid",
    description:
      "Flowcharts, Sequence Diagrams, Gantt Charts, Class Diagrams, State Diagrams, Entity Relationship Diagrams, User Journey Diagrams, Pie Charts, Requirement Diagrams, Gitgraph Diagrams, etc.",
  },
  {
    title: "Webpages",
    pplxSearch: "",
    trigger: "html",
    description: "JavaScript is enabled.",
  },
  {
    title: "Chain of Thought",
    pplxSearch: "LLM's chain of thought reasoning",
    trigger: "scratchpad",
    description: "LLM's chain of thought reasoning. Prompt is required.",
    actions: [
      {
        description: "Check out @paradroid's Scratchpad prompt",
        cta: "Open original thread",
        action: () => {
          window.open(
            "https://discord.com/channels/1047197230748151888/1223058316662538331/1285473963958472765",
          );
        },
      },
      {
        description: "Install Scratchpad prompt as a Collection",
        cta: "Install",
        action: async () => {
          if (whereAmI() === "unknown") {
            toast({
              title: "Unsupported Context",
              description: "Please do this action on Perplexity.ai",
            });

            return;
          }

          // unknown behavior that breaks dev mode when loading either one of these 2 modules in option page, so load them here
          const { webpageMessenger } = await import(
            "@/content-script/main-world/webpage-messenger"
          );

          const WebpageMessageInterceptor = await import(
            "@/content-script/main-world/WebpageMessageInterceptors"
          ).then((mod) => mod.default);

          webpageMessenger.sendMessage({
            event: "sendWebSocketMessage",
            payload: WsMessageParser.stringify({
              messageCode: 420,
              event: "create_collection",
              data: {
                version: "2.12",
                source: "default",
                title: "Scratchpad",
                description: "Force LLMs to use chain of thought reasoning",
                emoji: "",
                instructions: `[start] trigger - scratchpad - place step by step logic in scratchpad block: (\`\`\`scratchpad).Start every response with (\`\`\`scratchpad) then you give your full logic inside tags, then you close out using (\`\`\`). Strive for advanced reasoning to dissect the why behind the users intentions. Beyond the curtain:
          Example format:
          \`\`\`scratchpad
          [Strive for clarity and accuracy in your reasoning process, aiming to surpass human-level reasoning.]
          [Only display title and sub-task.IDs in your output.]
          [AttentionFocus: Identify critical elements (PrimaryFocus, SecondaryElements, PotentialDistractions)]
          [RevisionQuery: Restate question in your own words based on user hindsight]
          [TheoryOfMind: Analyze user perspectives (UserPerspective, AssumptionsAboutUserKnowledge, PotentialMisunderstandings)]
          [CognitiveOperations: List thinking processes (Abstraction, Comparison, Inference, Synthesis)]
          [ReasoningPathway: Outline logic steps (Premises, IntermediateConclusions, FinalInference]
          [Keyinfoextraction: concise exact key information extraction and review)]
          [One.step.time : task completion adheres to all sections and sub-tasks]
          [Metacognition: Analyze thinking process (StrategiesUsed, EffectivenessAssessment (1-100), AlternativeApproaches)]
          [Exploration: 5 thought-provoking questions based on the entire context so far.]

          \`\`\`
          [[Provide final comprehensive user reply synthesizing the contents and deep insight in scratchpad.]]`,
                access: 1,
              },
            }),
          });

          await WebpageMessageInterceptor.waitForCollectionCreation();

          toast({
            description: "✅ Scratchpad Collection installed",
          });
        },
      },
    ],
  },
] as const satisfies CanvasLangSetting[];
