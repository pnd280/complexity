export const backgroundProxyServiceName = "declarativeNetRequestService";

export class DeclarativeNetRequestServiceImpl {
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

  static async getActiveRules() {
    return chrome.declarativeNetRequest.getDynamicRules();
  }

  static async clearAllRules() {
    const existingRules = await this.getActiveRules();

    return this.updateDynamicRules({
      removeRuleIds: existingRules.map((rule) => rule.id),
    });
  }

  static async getHash(ruleName: string) {
    let hash = 0;
    for (let i = 0; i < ruleName.length; i++) {
      const char = ruleName.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    const positiveHash = Math.abs(hash);
    return (positiveHash % 90000) + 10000;
  }
}

export type DeclarativeNetRequestService =
  typeof DeclarativeNetRequestServiceImpl;
