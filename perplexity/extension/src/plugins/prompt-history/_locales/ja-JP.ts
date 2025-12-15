import type { Translations } from "@/plugins/prompt-history/_locales/index";

export default {
  clearAllButton: {
    dialog: {
      title: "プロンプト履歴を消去",
      message:
        "すべてのプロンプト履歴を消去しますか？この操作は元に戻せません。",
      actions: {
        cancel: "キャンセル",
        confirm: "すべて消去",
      },
    },
  },
  search: {
    placeholder: "プロンプト履歴を検索...",
    noResults: "結果が見つかりません",
  },
} as const satisfies Translations;
