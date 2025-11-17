import React from "react";
import { useLayoutEffect } from "react";
import { create, useStore } from "zustand";
import { mutative } from "zustand-mutative";

const queryBoxToolbarGroup = ["ll", "lr", "rl", "rr"] as const;

type QueryBoxToolbarComponentsGroup = (typeof queryBoxToolbarGroup)[number];

type QueryBoxToolbarComponentsGroupRegistry = {
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

type QueryBoxToolbarComponentsRegistry = Record<
  QueryBoxToolbarComponentsGroup,
  QueryBoxToolbarComponentsGroupRegistry
>;

export function createQueryBoxToolbarRegistry() {
  const registry = create<QueryBoxToolbarComponentsRegistry>()(
    mutative((set) => ({
      ll: {
        components: new Map(),
        add: ({ id, component }) => {
          set((draft) => {
            draft.ll.components.set(id, component);
          });
        },
        remove: ({ id }) => {
          set((draft) => {
            draft.ll.components.delete(id);
          });
        },
      },
      lr: {
        components: new Map(),
        add: ({ id, component }) => {
          set((draft) => {
            draft.lr.components.set(id, component);
          });
        },
        remove: ({ id }) => {
          set((draft) => {
            draft.lr.components.delete(id);
          });
        },
      },
      rl: {
        components: new Map(),
        add: ({ id, component }) => {
          set((draft) => {
            draft.rl.components.set(id, component);
          });
        },
        remove: ({ id }) => {
          set((draft) => {
            draft.rl.components.delete(id);
          });
        },
      },
      rr: {
        components: new Map(),
        add: ({ id, component }) => {
          set((draft) => {
            draft.rr.components.set(id, component);
          });
        },
        remove: ({ id }) => {
          set((draft) => {
            draft.rr.components.delete(id);
          });
        },
      },
    })),
  );

  const Components = ({ group }: { group: QueryBoxToolbarComponentsGroup }) => {
    const components = useStore(registry, (store) => store[group].components);

    return Array.from(components.entries()).map(([id, element]) =>
      React.cloneElement(element, { key: id }),
    );
  };

  const ComponentRegister = ({
    id,
    children,
    group,
  }: {
    id: string;
    children: React.ReactElement;
    group: QueryBoxToolbarComponentsGroup;
  }) => {
    useLayoutEffect(() => {
      registry.getState()[group].add({ id, component: children });
      return () => {
        registry.getState()[group].remove({ id });
      };
    }, [id, children, group]);

    return null;
  };

  return { registry, useRegistry: registry, Components, ComponentRegister };
}
