# Dropping `@lukemorales/query-key-factory`

## Rationale

1. **ESLint `exhaustive-deps` Conflicts**

   The library's nested `contextQueries` triggered false positives with `@tanstack/query/exhaustive-deps`.

   **Problem Example**:

   ```ts
   // Old version (with @lukemorales/query-key-factory)
   export const queries = createQueryKeys("spaces", {
     files: (spaceUuid: string) => ({
       queryKey: [{ spaceUuid }],
       queryFn: () => fetchFiles(spaceUuid),
       contextQueries: {
         downloadUrl: (fileUuid: string) => ({
           // Required manual override:
           // eslint-disable-next-line @tanstack/query/exhaustive-deps
           queryKey: [{ fileUuid }], // ❌ ESLint warning: 'spaceUuid' not in deps
           queryFn: () => fetchDownloadUrl({ spaceUuid, fileUuid }),
         }),
       },
     }),
   });
   ```

   **Solution**:

   ```ts
   // New version (manual keys)
   export const queries = {
     files: {
       all: (spaceUuid) => ["spaces", "files", { spaceUuid }] as const,
       detail: (spaceUuid) =>
         queryOptions({
           queryKey: queries.files.all(spaceUuid),
           queryFn: () => fetchFiles(spaceUuid),
         }),
       downloadUrl: {
         all: (spaceUuid, fileUuid) =>
           [
             ...queries.files.all(spaceUuid),
             "downloadUrl",
             { fileUuid },
           ] as const,
         detail: (spaceUuid, fileUuid) =>
           queryOptions({
             queryKey: queries.files.downloadUrl.all(spaceUuid, fileUuid), // ✅ ESLint happy
             queryFn: () => fetchDownloadUrl({ spaceUuid, fileUuid }),
           }),
       },
     },
   };
   ```

2. **No Type Inference with `queryClient.getQueryData`**
   - Return types defaulted to `unknown`, requiring manual type assertions.

## New Pattern

```ts
export const queries = {
  all: () => ["scope"] as const,
  endpoint: {
    all: () => [...queries.all(), "endpoint"] as const,
    detail: (params) =>
      queryOptions({
        queryKey: [...queries.endpoint.all(), params],
        queryFn: () => fetchData(params),
      }),
  },
};
```

Note: add `as const` to the `all()` and `queryKey` for literal type inference.

![Without `as const`](./without-as-const.png)
![With `as const`](./with-as-const.png)

## References

- https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
