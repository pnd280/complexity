import { pplxLocalLanguageModels } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/defaults";
import type { LanguageModel } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import type { ThreadMessageApiResponse } from "@/services/externals/pplx-api/pplx-api.types";
import { jsonUtils } from "@/utils/misc/utils";

type ThreadAnswer = {
  answer: string;
  web_results: PplxWebResult[];
};

export type PplxWebResult = {
  name: string;
  url: string;
  snippet: string;
};

export class PplxThreadExport {
  private languageModels: LanguageModel[];

  constructor({ languageModels }: { languageModels?: LanguageModel[] }) {
    this.languageModels =
      languageModels ?? Object.values(pplxLocalLanguageModels).flat();
  }

  private static extractQuery(message: ThreadMessageApiResponse) {
    return message.query_str;
  }

  private static extractAnswer(message: ThreadMessageApiResponse) {
    const text = jsonUtils.safeParse(message.text);

    return (
      (text.answer as string) ||
      (
        jsonUtils.safeParse(
          text[text.length - 1].content.answer,
        ) as ThreadAnswer
      ).answer
    );
  }

  private static extractWebResults(
    message: ThreadMessageApiResponse,
  ): PplxWebResult[] {
    const text = jsonUtils.safeParse(message.text);

    const webResults = text.web_results as PplxWebResult[] | undefined;

    if (webResults != null) {
      return webResults;
    }

    return (
      jsonUtils.safeParse(text[text.length - 1].content.answer) as ThreadAnswer
    ).web_results;
  }

  private getModelName(displayModel: string): string {
    return (
      this.languageModels.find((model) => model.code === displayModel)?.label ||
      displayModel
    );
  }

  static formatWebResults(webResults: PplxWebResult[]) {
    return webResults
      .map(
        (webResult, index) =>
          `[${index + 1}] [${webResult.name}](${webResult.url})`,
      )
      .join("  \n");
  }

  private static formatAnswerWithCitations(params: {
    query: string;
    answer: string;
    modelName: string;
    formattedWebResults: string;
    includeQuery: boolean;
  }): string {
    const { query, answer, modelName, formattedWebResults, includeQuery } =
      params;

    return [
      `# ${query}`,
      "",
      `# Answer (${modelName}):`,
      answer,
      "",
      "# Citations:",
      formattedWebResults,
    ]
      .slice(-(includeQuery ? 0 : 4))
      .join("  \n");
  }

  private static trimReferences(answer: string, webResults: PplxWebResult[]) {
    webResults.forEach((_, index) => {
      const findText = `\\[${index + 1}\\]`;
      answer = answer.replace(new RegExp(findText, "g"), "");
    });

    return answer;
  }

  private static formatAnswerWithoutCitations(params: {
    query: string;
    answer: string;
    modelName: string;
    includeQuery: boolean;
  }): string {
    const { query, answer, modelName, includeQuery } = params;

    return [`# ${query}`, "", `# Answer (${modelName}):`, answer]
      .slice(-(includeQuery ? 0 : 1))
      .join("  \n");
  }

  private exportMessage({
    message,
    includeCitations,
    includeQuery,
  }: {
    message: ThreadMessageApiResponse;
    includeCitations: boolean;
    includeQuery?: boolean;
  }) {
    const query = PplxThreadExport.extractQuery(message);
    const rawAnswer = PplxThreadExport.extractAnswer(message);
    const webResults = PplxThreadExport.extractWebResults(message);
    const formattedWebResults = PplxThreadExport.formatWebResults(webResults);
    const modelName = this.getModelName(message.display_model);

    if (includeCitations) {
      return PplxThreadExport.formatAnswerWithCitations({
        query,
        answer: rawAnswer,
        modelName,
        formattedWebResults,
        includeQuery: includeQuery ?? true,
      });
    }

    const answerWithoutCitations = PplxThreadExport.trimReferences(
      rawAnswer,
      webResults,
    );

    return PplxThreadExport.formatAnswerWithoutCitations({
      query,
      answer: answerWithoutCitations,
      modelName,
      includeQuery: includeQuery ?? true,
    });
  }

  exportThread({
    threadJSON,
    includeCitations,
    messageIndex,
  }: {
    threadJSON: ThreadMessageApiResponse[];
    includeCitations: boolean;
    messageIndex?: number;
  }) {
    const removeFollowupLinks = (text: string): string => {
      return text.replace(/\[(.*?)\]\(pplx:\/\/action\/followup\)/g, "$1");
    };

    // Export a single message if messageIndex is provided
    if (messageIndex != null && threadJSON[messageIndex] != null) {
      const exportedMessage = this.exportMessage({
        message: threadJSON[messageIndex],
        includeCitations,
        includeQuery: false,
      });

      return removeFollowupLinks(exportedMessage);
    }

    // Export the entire thread
    const exportedThread = threadJSON
      .map((message) =>
        this.exportMessage({
          message,
          includeCitations,
        }),
      )
      .join("  \n---  \n\n\n");

    return removeFollowupLinks(exportedThread);
  }
}
