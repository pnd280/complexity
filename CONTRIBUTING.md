Ahh, we all know how things work. Just don't throw in random, unverified AI-generated stuff. You can contribute to this project by opening issues and PRs. Please adhere to the following coding/refactoring conventions:

- No unused modules.
- No deprecated methods/modules.
- TypeScript:
  - Always prefer `type` over `interface` for type declarations.
  - Do not use `any` type, regardless of implicit or explicit.
  - Use built-in types whenever possible.
  - Don't use types that are banned by `eslint@typescript-eslint/ban-types`. e.g. `Function`.
- React:
  - Directly import modules/types instead of namespaces: `useState` instead of `React.useState`, `ReactNode` instead of `React.ReactNode`.
  - Always prefer the functional component format `function Component` over `const Component = React<FC>...`.
  - Always prefer to `export default function Component()...` than have the default export statement in a separated line.

> Note: I know that the project itself, in some places, doesn't fully comply with the above conventions (there are still some explicit `any` types). But they will eventually be refactored. So, please follow them when contributing.
