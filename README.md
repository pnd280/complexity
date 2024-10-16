<div align="center" style="magin-bottom: 2rem">
  <img src="public/icons/logo.svg" width="150px" />
  <h1 style="text-align: center;">Complexity</h1>
</div>

<p align="center">An enhanced version of <a href="https://perplexity.ai/" target="_blank" style="font-weight: bold">Perplexity.ai</a> which everyone has ever wanted.<br/>Community-driven, open-source, and free to use.</p>

<p align="center">
  <div align="center">
    <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fpnd280%2Fcomplexity%2Frefs%2Fheads%2Frelease-notes%2Fversions.json&query=chrome&label=stable" alt="Stable version">
    <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fpnd280%2Fcomplexity%2Falpha%2Fpackage.json&query=%24.version&label=alpha&color=yellow" alt="Alpha version">
    <a href="https://discord.gg/fxzqdkwmWx" target="_blank"><img src="https://img.shields.io/discord/1245377426331144304?logo=discord&label=discord&link=https%3A%2F%2Fdiscord.gg%2FfxzqdkwmWx" alt="Discord"></a>
  </div>
  <div align="center">
    <img src="https://img.shields.io/chrome-web-store/rating/ffppmilmeaekegkpckebkeahjgmhggpj?label=CWS%20rating" alt="Chrome Web Store Rating">
    <img src="https://img.shields.io/chrome-web-store/users/ffppmilmeaekegkpckebkeahjgmhggpj?label=CWS%20users" alt="Chrome Web Store Users">
    <img src="https://img.shields.io/amo/rating/complexity?label=AMO%20rating" alt="Mozilla Add-on Rating">
    <img src="https://img.shields.io/amo/users/complexity?label=AMO%20users" alt="Mozilla Add-on Users">
  </div>
</p>

<div align="center">
  <a href="https://chromewebstore.google.com/detail/complexity/ffppmilmeaekegkpckebkeahjgmhggpj" target="_blank"><img src="https://i.imgur.com/9QWBxZO.png" width="200px" style="border-radius: .5rem"></a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/complexity/" target="_blank"><img src="https://i.imgur.com/RpP2H81.png" width="200px"></a>
  <p align="center" style="font-style: italic; font-size: .8rem;">Complexity is a third-party extension, it does NOT affiliate with Perplexity.ai.</p>
  💖 support the development
<div>

<a href="https://paypal.me/pnd280" target="_blank"><img src="https://img.shields.io/badge/Paypal-blue?logo=paypal&logoColor=white" alt="Paypal"></a>
<a href="https://ko-fi.com/pnd280" target="_blank"><img src="https://img.shields.io/badge/Ko--fi-orange?logo=kofi&logoColor=white" alt="Ko-fi"></a>

</div>
</div>

Perplexity.ai is famously known for its LLM-based search engine, but many may not know that it is also a decent portal which provides access to various SOTA LLMs and image generation models and have somewhat a very generous rate limit compared to other services. But it lacks a lot of basic features, the UX isn't that great either. Hence, Complexity was created to fill that gap.

> [!NOTE]
> Complexity is going freemium! [Read more](https://github.com/pnd280/complexity/issues/19).

## Complexity will enrich your experience with:

- LLM/Image gen model selectors.
- Directly chat to a collection.
- Export your searches/conversations.
- Highly customizable ADHD-friendly theme (custom css is supported).
- Various UI/UX/QoL tweaks.
- A dedicated solution for prompts management: Prompts Library (in development).
- And many more...

[Read more](https://cplx.vercel.app)

## How does it work?

This is a high-level overview of the network traffic interception approach, which provides the extension with the ability to alter the behavior of the host page.

```mermaid
graph TD
    subgraph Browser
        W[perplexity.ai]
        CS[Content Scripts]
        BP[Background Page]
    end

    subgraph InterceptAPIs
        WI[Interceptor Instance]
        WI --> PWS[Proxy WebSocket]
        WI --> PXHR[Proxy XMLHttpRequest]
    end

    subgraph Interceptors
        WM[Controller]
        WM --> MP[Message Processor]
        WM --> IC[Interceptor Chain]
    end

    W <--> |WebSocket/XHR| PWS
    W <--> |WebSocket/XHR| PXHR

    WI <-.-> WM

    CS <--> WM
    BP <--> WM

    MP --> IC
    IC --> MP

    classDef singleton fill:#72aefd,stroke:#333,color:#ffffff,stroke-width:2px;
    class WI,WM singleton;
```

[Read more](./docs/architecture.md)

## Installation

- [Chrome Web Store](https://chromewebstore.google.com/detail/complexity/ffppmilmeaekegkpckebkeahjgmhggpj)
- [Mozilla Add-on](https://addons.mozilla.org/en-US/firefox/addon/complexity/)
- [Releases](https://github.com/pnd280/complexity/releases)

## Build from source

1. Clone this repository.
2. `pnpm build` or `pnpm build:firefox`.
3. Load the extension from the `dist` folder.

## Limitations

- Because of frequent/unexpected changes in the host page, UI tweaks are prone to breakage and it will take some time for the review process to be passed.
- The dev runtime/overall DX on mozilla-based browsers is non-existent due to a non-compatible dev dependency [@crxjs/vite-plugin](https://github.com/crxjs/chrome-extension-tools).
- Limited testing: the e2e test suite has not been implemented due to the aggressive Cloudflare protection of the host page itself (I'm still figuring out a way 🙂)

## Contributing

> [!NOTE]
> The project is undergoing significant refactoring, thus PRs are not welcome at the moment.

## Acknowledgements

- [The Discord community](https://discord.gg/fxzqdkwmWx) for the constant feedbacks/suggestions and support.
- [Perplexity.ai](https://perplexity.ai/) for an amazing product. (almost 😅)
- [DailyFocus](https://github.com/Dayleyfocus) for the name "**Complexity**" and early feedbacks/testing.
- [DanielLatorre](https://www.linkedin.com/in/daniellatorre/) for the `#72AEFD` default accent color.

## Reaching out 👋

- [Discord](https://discord.gg/fxzqdkwmWx) (userid: `feline9655`)
- [pnd280@gmail.com](mailto:pnd280@gmail.com)

## Support the development 💖

- [Paypal](https://paypal.me/pnd280)
- [Ko-fi](https://ko-fi.com/pnd280)
