import type { Plugin } from "vite";
import postcss from "postcss";
import type { AtRule, Declaration, Plugin as PostCSSPlugin } from "postcss";

export default function vitePluginTailwindCustomPrefixes(): Plugin {
  const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const prefixAnimationValue = (
    value: string,
    keyframes: Set<string>,
    prefix: string,
  ): string => {
    // Skip if contains var() - we don't want to modify CSS variable references
    if (value.includes("var(")) {
      return value;
    }

    // Sort keyframe names by length (longest first) to avoid partial replacements
    const sortedKeyframes = Array.from(keyframes).sort(
      (a, b) => b.length - a.length,
    );

    const animations = value.split(",").map((animation) => {
      let processed = animation.trim();

      for (const keyframeName of sortedKeyframes) {
        const regex = new RegExp(`\\b${escapeRegex(keyframeName)}\\b`, "g");

        processed = processed.replace(regex, (match, offset, fullString) => {
          const beforeMatch = fullString.substring(0, offset);

          if (beforeMatch.endsWith(prefix) === true) {
            return match;
          }

          // Skip if it looks like part of a time value (e.g., "2spin" should not match "spin")
          if (/\d$/.test(beforeMatch.trim()) === true) {
            return match;
          }

          const quoteMatches = beforeMatch.match(/"/g);
          const singleQuoteMatches = beforeMatch.match(/'/g);
          const beforeQuotes = quoteMatches !== null ? quoteMatches.length : 0;
          const beforeSingleQuotes =
            singleQuoteMatches !== null ? singleQuoteMatches.length : 0;
          const isInsideQuotes = beforeQuotes % 2 !== 0;
          const isInsideSingleQuotes = beforeSingleQuotes % 2 !== 0;
          if (isInsideQuotes || isInsideSingleQuotes) {
            return match;
          }

          if (
            beforeMatch.includes("url(") === true &&
            beforeMatch.includes(")") === false
          ) {
            return match;
          }

          return `${prefix}${match}`;
        });
      }

      return processed;
    });

    return animations.join(", ");
  };

  const transformCode = async (code: string): Promise<string> => {
    const keyframePrefix = "x-";
    const keyframeNames = new Set<string>();

    const prefixKeyframesPlugin: PostCSSPlugin = {
      postcssPlugin: "prefix-keyframes",
      Once(root) {
        // First pass: Find all @keyframes and prefix them
        root.walkAtRules("keyframes", (rule: AtRule) => {
          const originalName = rule.params.trim();

          if (!originalName.startsWith(keyframePrefix)) {
            keyframeNames.add(originalName);
            rule.params = `${keyframePrefix}${originalName}`;
          } else {
            // If already prefixed, extract the original name
            const unprefixedName = originalName.substring(
              keyframePrefix.length,
            );
            keyframeNames.add(unprefixedName);
          }
        });

        // Second pass: Update all animation references
        root.walkDecls((decl: Declaration) => {
          const prop = decl.prop.toLowerCase();

          if (prop === "animation" || prop === "animation-name") {
            decl.value = prefixAnimationValue(
              decl.value,
              keyframeNames,
              keyframePrefix,
            );
          }

          if (prop.startsWith("--")) {
            const containsKeyframe = Array.from(keyframeNames).some((name) => {
              const regex = new RegExp(`\\b${escapeRegex(name)}\\b`);
              return regex.test(decl.value);
            });

            if (containsKeyframe) {
              const hasAnimationSyntax =
                /\b(linear|ease|ease-in|ease-out|ease-in-out|infinite|alternate|forwards|backwards|both|none|running|paused|\d+(?:s|ms))\b/.test(
                  decl.value,
                );
              if (hasAnimationSyntax) {
                decl.value = prefixAnimationValue(
                  decl.value,
                  keyframeNames,
                  keyframePrefix,
                );
              }
            }
          }
        });

        // Third pass: Replace Tailwind CSS variables
        // Handle @property --tw-* syntax
        root.walkAtRules("property", (rule: AtRule) => {
          if (rule.params.startsWith("--tw-")) {
            rule.params = rule.params.replace(/^--tw-/, "--x-");
          }
        });

        root.walkDecls((decl: Declaration) => {
          if (decl.prop.startsWith("--tw-")) {
            decl.prop = decl.prop.replace(/^--tw-/, "--x-");
          }
          if (decl.value.includes("--tw-")) {
            decl.value = decl.value.replace(/--tw-/g, "--x-");
          }
        });
      },
    };

    const processor = postcss([prefixKeyframesPlugin]);
    const result = await processor.process(code, { from: undefined });

    return result.css;
  };

  return {
    name: "vite-plugin-tailwind-custom-prefixes",
    async transform(code, id) {
      if (
        (id.endsWith(".css") || id.includes(".css?")) &&
        !id.includes(".js") &&
        !id.includes(".mjs") &&
        !id.includes(".ts")
      ) {
        return {
          code: await transformCode(code),
          map: null,
        };
      }
    },
    async generateBundle(_options, bundle) {
      for (const fileName in bundle) {
        const asset = bundle[fileName];
        if (
          asset &&
          asset.type === "asset" &&
          fileName.endsWith(".css") &&
          typeof asset["source"] === "string"
        ) {
          asset["source"] = await transformCode(asset["source"]);
        }
      }
    },
  };
}
