import React, { useLayoutEffect } from "react";
import { create, useStore } from "zustand";
import { mutative } from "zustand-mutative";

type ComponentsRegistry = {
  components: Map<string, React.ReactElement>;
  add: ({
    id,
    component,
  }: {
    id: string;
    component: React.ReactElement;
  }) => void;
  remove: ({ id }: { id: string }) => void;
};

export function createUiGroupRegistry() {
  const registry = create<ComponentsRegistry>()(
    mutative((set) => ({
      components: new Map(),
      add: ({ id, component }) => {
        set((draft) => {
          draft.components.set(id, component);
        });
      },
      remove: ({ id }) => {
        set((draft) => {
          draft.components.delete(id);
        });
      },
    })),
  );

  const Components = () => {
    const components = useStore(registry, (store) => store.components);

    return Array.from(components.entries()).map(([id, element]) =>
      React.cloneElement(element, { key: id }),
    );
  };

  const ComponentRegister = ({
    id,
    children,
  }: {
    id: string;
    children: React.ReactElement;
  }) => {
    useLayoutEffect(() => {
      registry.getState().add({ id, component: children });
      return () => {
        registry.getState().remove({ id });
      };
    }, [id, children]);

    return null;
  };

  return { registry, useRegistry: registry, Components, ComponentRegister };
}
