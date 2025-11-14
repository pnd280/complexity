import type z from "zod";

import type {
  ThreadMessageApiResponse,
  ThreadMessageTextSchema,
} from "@/services/externals/pplx-api/pplx-api.types";

export type PplxWebResult = z.infer<
  typeof ThreadMessageTextSchema.shape.web_results
>[number];

export class PplxThreadExport {
  static extractQuery(message: ThreadMessageApiResponse) {
    return message.query_str;
  }

  static extractAnswer(message: ThreadMessageApiResponse) {
    return message.text.answer;
  }

  static extractWebResults(message: ThreadMessageApiResponse): PplxWebResult[] {
    return message.text.web_results;
  }

  static formatWebResults(webResults: PplxWebResult[]) {
    return webResults
      .map(
        (webResult, index) =>
          `[${index + 1}] [${webResult.name}](${webResult.url})`,
      )
      .join("  \n");
  }

  static formatAnswerWithCitations(params: {
    query: string;
    answer: string;
    formattedWebResults: string;
    includeQuery: boolean;
  }): string {
    const { query, answer, formattedWebResults, includeQuery } = params;

    return [`# ${query}`, "", answer, "", "# Citations:", formattedWebResults]
      .slice(-(includeQuery ? 0 : 4))
      .join("  \n");
  }

  static trimReferences({
    answer,
    webResults,
  }: {
    answer: string;
    webResults: PplxWebResult[];
  }) {
    webResults.forEach((_, index) => {
      const findText = `\\[${index + 1}\\]`;
      answer = answer.replace(new RegExp(findText, "g"), "");
    });

    return answer;
  }

  static formatAnswerWithoutCitations(params: {
    query: string;
    answer: string;
    includeQuery: boolean;
  }): string {
    const { query, answer, includeQuery } = params;

    return [`# ${query}`, "", answer]
      .slice(-(includeQuery ? 0 : 1))
      .join("  \n");
  }

  static exportMessage({
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

    if (includeCitations) {
      return PplxThreadExport.formatAnswerWithCitations({
        query,
        answer: rawAnswer,
        formattedWebResults,
        includeQuery: includeQuery ?? true,
      });
    }

    const answerWithoutCitations = PplxThreadExport.trimReferences({
      answer: rawAnswer,
      webResults,
    });

    return PplxThreadExport.formatAnswerWithoutCitations({
      query,
      answer: answerWithoutCitations,
      includeQuery: includeQuery ?? true,
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
    const removeFollowupLinks = (text: string): string => {
      return text.replace(/\[(.*?)\]\(pplx:\/\/action\/followup\)/g, "$1");
    };

    // Export a single message if messageIndex is provided
    if (messageIndex != null && threadJSON[messageIndex] != null) {
      const exportedMessage = PplxThreadExport.exportMessage({
        message: threadJSON[messageIndex],
        includeCitations,
        includeQuery: false,
      });

      return removeFollowupLinks(exportedMessage);
    }

    // Export the entire thread
    const exportedThread = threadJSON
      .map((message) =>
        PplxThreadExport.exportMessage({
          message,
          includeCitations,
        }),
      )
      .join("  \n---  \n\n\n");

    return removeFollowupLinks(exportedThread);
  }
}
