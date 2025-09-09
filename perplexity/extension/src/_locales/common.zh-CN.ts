import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "请考虑成为<0>支持者</0>，以保持项目的活力！",
  },
  sponsorDialog: {
    title: "帮助保持Complexity的卓越！",
    description:
      "我们投入了无数小时，使Complexity成为一个强大且精致的工具。您的支持直接推动持续开发、新功能，并保持一切顺利运行。",
    descriptionLine2:
      "如果Complexity为您的工作流程带来价值，请考虑为它的未来贡献一份力量！",
    donation: {
      title: "💖 支持未来开发",
    },
    sponsorship: {
      title: "🌟 有兴趣赞助吗？",
      contactEmail: "通过电子邮件联系",
    },
  },
  misc: {
    words: "单词",
    characters: "字符",
    rewrite: "重写",
    speakAloud: "朗读",
    stop: "停止",
  },
  releaseNotes: {
    title: "已更新至v{version}",
    dontShowAgain: "不再显示此更新",
    confirmDialog: {
      title: "确认",
      message: "确定不再显示此更新？您可以随时在设置页面重新启用此弹窗。",
      cancel: "取消",
      confirm: "我知道了",
    },
    dismiss: "关闭",
  },
} as const satisfies Translations;
