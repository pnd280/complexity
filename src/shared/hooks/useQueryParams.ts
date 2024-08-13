import { useState, useCallback, useEffect } from "react";

type QueryParamValue = string | number | boolean | null;

type QueryParams<T extends Record<string, QueryParamValue>> = T;

type UpdateOptions = {
  replace?: boolean;
};

function parseQueryParams<
  T extends Record<string, QueryParamValue>,
>(): QueryParams<T> {
  const searchParams = new URLSearchParams(window.location.search);
  const params: Record<string, QueryParamValue> = {};

  searchParams.forEach((value, key) => {
    if (value === "true") {
      params[key] = true;
    } else if (value === "false") {
      params[key] = false;
    } else if (value === "") {
      params[key] = null;
    } else if (!isNaN(Number(value))) {
      params[key] = Number(value);
    } else {
      params[key] = value;
    }
  });

  return params as QueryParams<T>;
}

export default function useQueryParams<
  T extends Record<string, QueryParamValue>,
>(): [
  QueryParams<T>,
  (params: Partial<QueryParams<T>>, options?: UpdateOptions) => void,
] {
  const [queryParams, setQueryParams] =
    useState<QueryParams<T>>(parseQueryParams);

  // Update query params in URL and state
  const updateQueryParams = useCallback(
    (newParams: Partial<QueryParams<T>>, options: UpdateOptions = {}) => {
      const searchParams = new URLSearchParams(window.location.search);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          searchParams.delete(key);
        } else {
          searchParams.set(key, String(value));
        }
      });

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;

      if (options.replace) {
        window.history.replaceState({}, "", newUrl);
      } else {
        window.history.pushState({}, "", newUrl);
      }

      setQueryParams((prevParams) => ({ ...prevParams, ...newParams }));
    },
    [],
  );

  // Initialize query params on mount and when URL changes
  useEffect(() => {
    const handlePopState = () => {
      const currentParams = parseQueryParams<T>();
      setQueryParams(currentParams);
    };

    window.addEventListener("popstate", handlePopState);
    handlePopState(); // Initialize on mount

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return [queryParams, updateQueryParams];
}
