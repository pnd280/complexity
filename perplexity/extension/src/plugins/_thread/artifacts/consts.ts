import type { ComponentType, SVGProps } from "react";

import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import MarkmapArtifactsActionButtonsWrapper from "@/plugins/_thread/artifacts/components/action-buttons/Markmap/Wrapper";
import MermaidArtifactsActionButtonsWrapper from "@/plugins/_thread/artifacts/components/action-buttons/Mermaid/Wrapper";
import PlantUmlArtifactsActionButtonsWrapper from "@/plugins/_thread/artifacts/components/action-buttons/PlantUml/Wrapper";
import HtmlRenderer from "@/plugins/_thread/artifacts/components/renderer/Html";
import MarkdownRenderer from "@/plugins/_thread/artifacts/components/renderer/Markdown";
import MarkmapRenderer from "@/plugins/_thread/artifacts/components/renderer/Markmap";
import MermaidRenderer from "@/plugins/_thread/artifacts/components/renderer/Mermaid";
import PlantUmlRenderer from "@/plugins/_thread/artifacts/components/renderer/PlantUml";
import ReactRenderer from "@/plugins/_thread/artifacts/components/renderer/React";
import type {
  ArtifactLanguage,
  ArtifactView,
} from "@/plugins/_thread/artifacts/types";

import ArcticonsUmlClassEditor from "~icons/arcticons/uml-class-editor";
import IconParkMindmap from "~icons/icon-park-outline/mindmap-map";
import TreeOutlineRounded from "~icons/material-symbols/account-tree-outline-rounded";
import MdiXml from "~icons/mdi/xml";
import StashArticle from "~icons/stash/article";
import TablerBrandReact from "~icons/tabler/brand-react";

export let ARTIFACTS_LANGUAGE_PREVIEW_TOGGLE_TEXT: Record<
  ArtifactLanguage,
  string
> = {} as Record<ArtifactLanguage, string>;

export let ARTIFACTS_LANGUAGE_RAW_TOGGLE_TEXT: Record<
  ArtifactLanguage,
  string
> = {} as Record<ArtifactLanguage, string>;

export const ARTIFACT_INITIAL_STATE: Record<ArtifactLanguage, ArtifactView> = {
  markdown: "preview",
  mermaid: "code",
  html: "code",
  react: "code",
  plantuml: "code",
  markmap: "preview",
  svg: "preview",
  md: "preview",
  mmd: "preview",
};

type ArtifactPlaceholders = Record<
  ArtifactLanguage,
  {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    defaultTitle: string;
    description: string;
  }
>;

export let ARTIFACT_PLACEHOLDERS: ArtifactPlaceholders =
  {} as ArtifactPlaceholders;

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:thread:artifacts:codeBlockPlaceholdersData": void;
  }
}

AsyncLoaderRegistry.register({
  id: "plugin:thread:artifacts:codeBlockPlaceholdersData",
  dependencies: ["lib:i18n"],
  loader: () => {
    ARTIFACTS_LANGUAGE_PREVIEW_TOGGLE_TEXT = {
      markdown: t("plugin-artifacts.toggle.preview"),
      mermaid: t("plugin-artifacts.toggle.preview"),
      html: t("plugin-artifacts.toggle.preview"),
      react: t("plugin-artifacts.toggle.preview"),
      plantuml: t("plugin-artifacts.toggle.preview"),
      markmap: t("plugin-artifacts.toggle.preview"),
      svg: t("plugin-artifacts.toggle.preview"),
      md: t("plugin-artifacts.toggle.preview"),
      mmd: t("plugin-artifacts.toggle.preview"),
    };

    ARTIFACTS_LANGUAGE_RAW_TOGGLE_TEXT = {
      markdown: t("plugin-artifacts.toggle.markdown"),
      mermaid: t("plugin-artifacts.toggle.code"),
      html: t("plugin-artifacts.toggle.code"),
      react: t("plugin-artifacts.toggle.code"),
      plantuml: t("plugin-artifacts.toggle.code"),
      markmap: t("plugin-artifacts.toggle.code"),
      svg: t("plugin-artifacts.toggle.code"),
      md: t("plugin-artifacts.toggle.code"),
      mmd: t("plugin-artifacts.toggle.code"),
    };

    ARTIFACT_PLACEHOLDERS = {
      md: {
        icon: StashArticle,
        defaultTitle: "Markdown",
        description: t("plugin-artifacts.placeholder.description", {
          name: "markdown",
        }),
      },
      markdown: {
        icon: StashArticle,
        defaultTitle: "Markdown",
        description: t("plugin-artifacts.placeholder.description", {
          name: "markdown",
        }),
      },
      mmd: {
        icon: TreeOutlineRounded,
        defaultTitle: "Mermaid",
        description: t("plugin-artifacts.placeholder.description", {
          name: "mermaid",
        }),
      },
      mermaid: {
        icon: TreeOutlineRounded,
        defaultTitle: "Mermaid",
        description: t("plugin-artifacts.placeholder.description", {
          name: "mermaid",
        }),
      },
      html: {
        icon: MdiXml,
        defaultTitle: "HTML",
        description: t("plugin-artifacts.placeholder.description", {
          name: "html",
        }),
      },
      svg: {
        icon: MdiXml,
        defaultTitle: "SVG",
        description: t("plugin-artifacts.placeholder.description", {
          name: "html",
        }),
      },
      react: {
        icon: TablerBrandReact,
        defaultTitle: "React",
        description: t("plugin-artifacts.placeholder.description", {
          name: "react",
        }),
      },
      plantuml: {
        icon: ArcticonsUmlClassEditor,
        defaultTitle: "PlantUML",
        description: t("plugin-artifacts.placeholder.description", {
          name: "plantuml",
        }),
      },
      markmap: {
        icon: IconParkMindmap,
        defaultTitle: "Mindmap",
        description: t("plugin-artifacts.placeholder.description", {
          name: "markmap",
        }),
      },
    };
  },
});

export const ARTIFACT_RENDERERS: Record<ArtifactLanguage, ComponentType> = {
  mmd: MermaidRenderer,
  mermaid: MermaidRenderer,
  md: MarkdownRenderer,
  markdown: MarkdownRenderer,
  html: HtmlRenderer,
  svg: HtmlRenderer,
  react: ReactRenderer,
  plantuml: PlantUmlRenderer,
  markmap: MarkmapRenderer,
};

export const ARTIFACT_LANGUAGE_ACTION_BUTTONS: Record<
  ArtifactLanguage,
  ComponentType | null
> = {
  mmd: null,
  mermaid: MermaidArtifactsActionButtonsWrapper,
  html: null,
  svg: null,
  react: null,
  md: null,
  markdown: null,
  plantuml: PlantUmlArtifactsActionButtonsWrapper,
  markmap: MarkmapArtifactsActionButtonsWrapper,
};
