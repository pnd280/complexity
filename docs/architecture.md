# How does Complexity work?

Complexity is a web extension that aims to enhance the user experience and functionality of Perplexity.ai.

The following implementations are opinionated and may not be the best solution. One can always suggest better approaches, [CONTRIBUTE](../CONTRIBUTING.md)!

## Intercepting Websocket Messages

By overriding native classes and methods, Complexity is able to intercept and modify the messages sent and received by the Perplexity.ai's websocket connection, including the fallback to long-polling.

## Custom DOM Mutation Observer

Although the all LLMs' context window on Perplexity.ai is limited to roughly 32K, a thread/convo can get infinitely long, there's no limit to how many messages can be sent. And the performance of the page will degrade as the thread grows. To have extra features, while maintaining the performance, excessive use of MutationObserver guarantees to significantly slow down the page. To tackle this, Complexity has a custom implemented MutationObserver wrapper class that applies many optimizations to keep the main thread as responsive as possible.

## Communication between js contexts

Due to the restriction of the isolated context, content scripts in isolated context cannot directly access the `window` object, react fiber node data, and the Websocket class itself, which a lot of the features of Complexity rely on. Hence, Complexity implements a simple request-response communication bridge to share data between different js contexts (isolated <-> main-world) based on the `window.postMessage` API.

## React

Complexity UI's is rendered using React:

- TailwindCSS for styling.
- Ark-UI for headless UI components.

Complexity uses a combination of @tanstack/react-query and zustand for state management:

- @tanstack/react-query for overall async states: data fetching and internal communication between js contexts.
- zustand for local states: UI states and other local states.

## Why there is `jquery` dependency?

- Although it is mentioned that the project uses React, `jquery` is exclusively used for direct DOM selections and manipulations of the host page. It provides much better DX than vanilla js methods.
