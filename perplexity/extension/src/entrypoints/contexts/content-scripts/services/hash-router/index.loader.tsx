import {
  createHashRouter as createHashRouterReactRouterDom,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { create, useStore } from "zustand";
import { mutative } from "zustand-mutative";

import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

type HashRouterRoutesRegistry = {
  routes: Map<string, RouteObject>;
  add: ({ id, route }: { id: string; route: RouteObject }) => void;
  remove: ({ id }: { id: string }) => void;
};

const hashRouterRoutesRegistry = create<HashRouterRoutesRegistry>()(
  mutative((set) => ({
    routes: new Map(),
    add: ({ id, route }) =>
      set((draft) => {
        draft.routes.set(id, route);
      }),
    remove: ({ id }) =>
      set((draft) => {
        draft.routes.delete(id);
      }),
  })),
);

export function registerHashRouterRoute(params: {
  id: string;
  route: RouteObject;
}) {
  hashRouterRoutesRegistry.getState().add(params);
}

function HashRouter() {
  const routes = useStore(hashRouterRoutesRegistry, (state) => state.routes);

  const router = createHashRouterReactRouterDom([
    {
      path: "/",
      element: null,
      children: Array.from(routes.values()),
      errorElement: null,
    },
    {
      path: "*",
      element: null,
      errorElement: null,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default function () {
  csUiMount({ id: "corePlugin:hashRouter", component: <HashRouter /> });
}
