import $ from 'jquery';

import background from './background';

type Modules = {
  mermaid?: void;
};

const modulesCache: Modules = {};
const importPromises: {
  [K in keyof Modules]: Promise<Modules[K]>;
} = {};

export async function mermaid(): Promise<void> {
  if (modulesCache.mermaid) return;

  if (importPromises.mermaid) {
    return;
  }

  importPromises.mermaid = background.sendMessage({
    action: 'injectMermaid',
    payload: {
      darkTheme: $('html').hasClass('dark'),
    },
  });

  return;
}

const artifactsImports = {
  mermaid,
};

export default artifactsImports;
