import React from "react";
import { useLayoutEffect } from "react";
import { create, useStore } from "zustand";
import { mutative } from "zustand-mutative";

const queryBoxToolbarGroup = ["ll", "lr", "rl", "rr"] as const;

type QueryBoxToolbarComponentsGroup = (typeof queryBoxToolbarGroup)[number];

type QueryBoxToolbarComponentsGroupRegistry = {
  components: React.ReactElement[];
  add: (component: React.ReactElement) => void;
  remove: (component: React.ReactElement) => void;
};

type QueryBoxToolbarComponentsRegistry = Record<
  QueryBoxToolbarComponentsGroup,
  QueryBoxToolbarComponentsGroupRegistry
>;

export function createQueryBoxToolbarRegistry() {
  const registry = create<QueryBoxToolbarComponentsRegistry>()(
    mutative((set) => ({
      ll: {
        components: [],
        add: (component) => {
          set((draft) => {
            draft.ll.components.push(component);
          });
        },
        remove: (component) => {
          set((draft) => {
            draft.ll.components = draft.ll.components.filter(
              (p) => p !== component,
            );
          });
        },
      },
      lr: {
        components: [],
        add: (component) => {
          set((draft) => {
            draft.lr.components.push(component);
          });
        },
        remove: (component) => {
          set((draft) => {
            draft.lr.components = draft.lr.components.filter(
              (p) => p !== component,
            );
          });
        },
      },
      rl: {
        components: [],
        add: (component) => {
          set((draft) => {
            draft.rl.components.push(component);
          });
        },
        remove: (component) => {
          set((draft) => {
            draft.rl.components = draft.rl.components.filter(
              (p) => p !== component,
            );
          });
        },
      },
      rr: {
        components: [],
        add: (component) => {
          set((draft) => {
            draft.rr.components.push(component);
          });
        },
        remove: (component) => {
          set((draft) => {
            draft.rr.components = draft.rr.components.filter(
              (p) => p !== component,
            );
          });
        },
      },
    })),
  );

  const Components = ({ group }: { group: QueryBoxToolbarComponentsGroup }) => {
    const components = useStore(registry, (store) => store[group].components);
    return components.map((element, index) =>
      React.cloneElement(element, { key: index }),
    );
  };

  const ComponentRegister = ({
    children,
    group,
  }: {
    children: React.ReactElement;
    group: QueryBoxToolbarComponentsGroup;
  }) => {
    useLayoutEffect(() => {
      registry.getState()[group].add(children);
      return () => {
        registry.getState()[group].remove(children);
      };
    }, [children, group]);

    return null;
  };

  return { registry, useRegistry: registry, Components, ComponentRegister };
}
