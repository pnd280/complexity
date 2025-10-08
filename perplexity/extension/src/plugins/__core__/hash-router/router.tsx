import { createHashRouter } from "react-router-dom";

import { hashRouterObservers } from "@/__registries__/cs-hash-router";

export const createRouter = () =>
  createHashRouter([
    {
      path: "/",
      element: null,
      children: [...hashRouterObservers],
      errorElement: null,
    },
    {
      path: "*",
      element: null,
      errorElement: null,
    },
  ]);
