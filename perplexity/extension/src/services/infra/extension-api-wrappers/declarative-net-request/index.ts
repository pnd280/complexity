export const backgroundProxyServiceName = "declarativeNetRequestService";

export class DeclarativeNetRequestService {
  static async updateDynamicRules({
    removeRuleIds,
    addRules,
  }: {
    removeRuleIds?: number[];
    addRules?: chrome.declarativeNetRequest.Rule[];
  }) {
    return chrome.declarativeNetRequest.updateDynamicRules({
      addRules,
      removeRuleIds,
    });
  }
}
