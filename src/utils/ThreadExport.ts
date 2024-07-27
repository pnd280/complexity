import { languageModels } from "@/content-script/components/QueryBox";
import { ThreadMessageApiResponse } from "@/types/pplx-api.types";

import { jsonUtils } from "./utils";

type ThreadAnswer = {
  answer: string;
  web_results: WebResult[];
};

type WebResult = {
  name: string;
  url: string;
  snippet: string;
};

export default class ThreadExport {
  private static extractQuery(message: ThreadMessageApiResponse) {
    return message.query_str;
  }

  private static extractAnswer(message: ThreadMessageApiResponse) {
    const text = jsonUtils.safeParse(message.text);

    return (
      text.answer ||
      (
        jsonUtils.safeParse(
          text[text.length - 1].content.answer,
        ) as ThreadAnswer
      ).answer
    );
  }

  private static extractWebResults(
    message: ThreadMessageApiResponse,
  ): WebResult[] {
    const text = jsonUtils.safeParse(message.text);

    return (
      text.web_results ||
      (
        jsonUtils.safeParse(
          text[text.length - 1].content.answer,
        ) as ThreadAnswer
      ).web_results
    );
  }

  private static getModelName(displayModel: string): string {
    return (
      languageModels.find((model) => model.code === displayModel)?.label ||
      displayModel
    );
  }

  private static formatWebResults(webResults: WebResult[]) {
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
  }): string {
    const { query, answer, modelName, formattedWebResults } = params;

    return [
      `# ${query}`,
      "",
      `# Answer (${modelName}):`,
      answer,
      "",
      "# Citations:",
      formattedWebResults,
    ].join("  \n");
  }

  private static trimReferences(answer: string, webResults: WebResult[]) {
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
  }): string {
    const { query, answer, modelName } = params;

    return [`# ${query}`, "", `# Answer (${modelName}):`, answer].join("  \n");
  }

  private static exportMessage({
    message,
    includeCitations,
  }: {
    message: ThreadMessageApiResponse;
    includeCitations: boolean;
  }) {
    const query = ThreadExport.extractQuery(message);
    const rawAnswer = ThreadExport.extractAnswer(message);
    const webResults = ThreadExport.extractWebResults(message);
    const formattedWebResults = ThreadExport.formatWebResults(webResults);
    const modelName = ThreadExport.getModelName(message.display_model);

    if (includeCitations) {
      return ThreadExport.formatAnswerWithCitations({
        query,
        answer: rawAnswer,
        modelName,
        formattedWebResults,
      });
    }

    const answerWithoutCitations = ThreadExport.trimReferences(
      rawAnswer,
      webResults,
    );

    return ThreadExport.formatAnswerWithoutCitations({
      query,
      answer: answerWithoutCitations,
      modelName,
    });
  }

  static exportThread({
    threadJSON,
    includeCitations,
    messageIndex,
  }: {
    threadJSON: ThreadMessageApiResponse[];
    includeCitations: boolean;
    messageIndex?: number;
  }) {
    if (messageIndex) {
      return ThreadExport.exportMessage({
        message: threadJSON[messageIndex],
        includeCitations,
      });
    }

    return threadJSON
      .map((message) =>
        ThreadExport.exportMessage({
          message,
          includeCitations,
        }),
      )
      .join("  \n---  \n\n\n");
  }
}
