import $ from 'jquery';

import { getReactFiberKey, jsonUtils } from '@/utils/utils';
import { webpageMessenger } from './webpage-messenger';
import { mainWorldExec, mainWorldOnly } from '@/utils/hoc';

export type ReactNodeAction = keyof typeof actions;
export type ReactNodeActionReturnType = {
  [K in ReactNodeAction]: ReturnType<(typeof actions)[K]>;
};

export type PPLXThreadMessageReactFiberResult = {
  answer: string;
  web_results: {
    name: string;
    url: string;
  }[];
};

const actions = {
  getCodeFromPreBlock: mainWorldOnly((pre: Element): string => {
    return (pre as any)[getReactFiberKey(pre)]?.memoizedProps?.children[0]
      ?.props?.children[0];
  }),
  getMessageData: mainWorldOnly(
    (messageBlock: Element): PPLXThreadMessageReactFiberResult => {
      const result = jsonUtils.safeParse(
        (messageBlock as any)[getReactFiberKey(messageBlock)]?.memoizedProps
          ?.children?.props?.result?.text
      );

      return Array.isArray(result)
        ? jsonUtils.safeParse(result[result.length - 1]?.content?.answer)
        : result;
    }
  ),
} as const;

mainWorldExec(() => {
  webpageMessenger.onMessage(
    'getReactNodeData',
    async ({ payload: { querySelector, action } }) => {
      const $node = $(querySelector);

      if (!$node.length) return;

      return actions[action]($node[0]);
    }
  );
})();
