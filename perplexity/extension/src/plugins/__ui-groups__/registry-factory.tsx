import React, { useLayoutEffect } from "react";
import { create, useStore } from "zustand";
import { mutative } from "zustand-mutative";

type ComponentsRegistry = {
  components: React.ReactElement[];
  add: (component: React.ReactElement) => void;
  remove: (component: React.ReactElement) => void;
};

export function createUiGroupRegistry() {
  const registry = create<ComponentsRegistry>()(
    mutative((set) => ({
      components: [],
      add: (component) => {
        set((draft) => {
          draft.components.push(component);
        });
      },
      remove: (component) => {
        set((draft) => {
          draft.components = draft.components.filter((p) => p !== component);
        });
      },
    })),
  );

  const Components = () => {
    const components = useStore(registry, (store) => store.components);

    return components.map((element, index) =>
      React.cloneElement(element, { key: index }),
    );
  };

  const ComponentRegister = ({
    children,
  }: {
    children: React.ReactElement;
  }) => {
    useLayoutEffect(() => {
      registry.getState().add(children);
      return () => {
        registry.getState().remove(children);
      };
    }, [children]);

    return null;
  };

  return { registry, useRegistry: registry, Components, ComponentRegister };
}
