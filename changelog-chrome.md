### PSA: Your Perplexity.ai user interface **MUST** be in **ENGLISH**. And please turn off any 3rd party translation extenstions/plugins (including browser setttings).

---

Complexity is going freemium soon, offering access to more advanced features. Features up to the official transition will remain free forever. Read more about it [here](https://github.com/pnd280/complexity/issues/19).

Consider giving a star ⭐ on [Github](https://github.com/pnd280/complexity).

💖 Support the development via [Ko-fi](https://ko-fi.com/pnd280) or [Paypal](https://paypal.me/pnd280).

**EXPERIMENTAL** features are subjected to change/removal without prior notice.

## v0.0.5.2

_Release date: 29th Oct, 2024_

-   Added Grok-2 model.

## v0.0.5.1

_Release date: 26th Oct, 2024_

-   **NEW** | **EXPERIMENTAL**: Text-to-Speech. Credit to `@asura0_00` for helping with the implementation.
    ![TTS](https://i.imgur.com/BglHpbJ.png)

    -   This feature **only works on CHROMIUM browsers**, and only available on Perplexity Pro/Enterprise accounts.
    -   Support 4 different voices (exactly the same as the mobile/mac app). Right click the "Headphones" icon to open the dropdown menu.
    -   Play/pause, seek, volume control, download will be added soon.

-   **FIX**: Fixed minor bugs.

## v0.0.4.8

_Release date: 25th Oct, 2024_

-   **FIX**: Fixed crashing issue on certain scenarios.
-   **FIX**: Fixed store url on Firefox browsers.

## v0.0.4.7

_Release date: 24th Oct, 2024_

-   **CHANGE**: Remove the ability to change focus mode mid thread due to Perplexity's changes. Here are things you can still do:

    -   Use focus mode with Spaces.
    -   Use focus mode with Pro Enterprise accounts.
    -   Choose to whether include Space/Org's files mid thread.

-   **FIX**: Query box's suggestion panel overlaps the Space selector.

## v0.0.4.6

_Release date: 22nd Oct, 2024_

-   **NEW**: Added support for Organization files (Pro Enterprise accounts only). Thanks `@Jason` for an enterprise slot at his organization.

## v0.0.4.5

_Release date: 20th Oct, 2024_

-   **FIX**: Fixed a bug where Space selector doesn't auto-select the space when in Space's page.

## v0.0.4.2

_Release date: 20th Oct, 2024_

-   **FIX**: Fixed a bug where selectors get duplicated in follow-up query box.
-   **FIX**: Fixed the Thread TOC panel overlapping the sources panel.

## v0.0.4.1

_Release date: 20th Oct, 2024_

-   **FIX**: Fixed performance issues.

## v0.0.4.0

_Release date: 18th Oct, 2024_

-   **NEW**: New "Space" selector.
    -   It is now **mandatory** to enable both "Space" and "Focus Mode" selectors. Quick editing popup is removed.
        ![Space setting](https://i.imgur.com/tuq3nkQ.png)
    -   Spaces that have files uploaded will have an extra focus mode option to include files in the context.
        ![Space preview](https://i.imgur.com/Ez1ndO1.png)
        ![Space preview](https://i.imgur.com/2ILreiy.png)
    -   Selecting a Space auto-switches to its predefined language model, but you can still change it on-the-fly.
    -   Display emoji.
    -   **NOTE**: Files search only works when Pro Search is enabled. Complexity automatically turns on Pro Search when you select a space that has at least 1 file uploaded.

## v0.0.3.14

_Release date: 16th Oct, 2024_

-   **FIX**: Fixed UI glitch on Collection preview boxes (in Library).

## v0.0.3.13

_Release date: 11th Oct, 2024_

-   **FIX**: Adapt to new query box dynamic placeholders - fixed a bug where selectors are not showing.
-   **FIX**: Fixed the store url on the Firefox addon.
-   **REMOVE**: **Temporarily** removed **Auto-generate thread title** setting.

## v0.0.3.11

_Release date: 8th Oct, 2024_

-   **IMPROVE**: `Ctrl (Cmd) + Shift + V` to bypass file creation on long text paste. Normal paste will still create a file.

## v0.0.3.6

_Release date: 23rd Sep, 2024_

-   **CHANGE**: Removed custom slogan/heading customization.

## v0.0.3.5

_Release date: 22nd Sep, 2024_

-   **NEW** | **EXPERIMENTAL**: Explicitly keep track of the Pro Search state (Prevent auto-toggling off).

-   **FIX**: Fixed infinte initializing loop.
-   **FIX**: Fixed the Rewrite dropdown (Thread Message Sticky Toolbar) - html structure changed.

## v0.0.3.4

_Release date: 21st Sep, 2024_

-   **IMPROVE**: Collections will now be fetched at instant speed.

## v0.0.3.3

_Release date: 21st Sep, 2024_

-   **NEW**: Add syntax highlighting for `vue`.

-   **IMPROVE**: Remove the "Parsed data is not in the expected format" console error message.

## v0.0.3.2

_Release date: 20st Sep, 2024_

-   **FIX**: Non selectable item in Image Generation Model Selector.

## v0.0.3.1

_Release date: 20th Sep, 2024_

-   **NEW**: Toggle All Settings button.

-   **IMPROVE**: The floating Settings button will now be highlighted for first-time users.

-   **FIX**: Fixed a bug where the Collection selector is not showing for free users.

## v0.0.3.0

_Release date: 19th Sep, 2024_

-   **NEW** | **EXPERIMENTAL**: Auto generate thread title.

-   **IMPROVE**: Better onboarding experience - Added descriptions for all settings.
-   **IMPROVE**: Redesigned the Focus Selector UI. Now it's more intuitive for new users.
-   **IMPROVE**: Significantly reduce the chance of being stuck in infinite message generating state.

-   **FIX**: Fixed minor bugs.

## v0.0.2.0

_Release date: 15th Sep, 2024_

-   **NEW**: Added **O1 Mini** model.
    > You can explicitly choose the `O1 Mini` model and not via the "Reasoning" focus mode.
-   **NEW**: Added `scratchpad` canvas. Specifically for masking LLM's reasoning tokens. Prompt is required, check out `@paradroid/dayman`'s scratchpad [prompt](https://discord.com/channels/1047197230748151888/1223058316662538331/1285473963958472765).

-   **IMPROVE**: Export individual messages will now exclude the query.
-   **IMPROVE**: Changelog page will now only be automatically opened on the first install.
-   **IMPROVE**: Improved the Collections fetch speed and fixed a bug where it failed to load in certain cases.

-   **FIX**: Fixed compatibility issues with Chrome 130.
-   **FIX**: Fixed the presence of the delete message button in incognito mode and vice versa.
-   **FIX**: Chat input panel overlaps content on narrow viewports.
-   **FIX**: Fixed many minor UI glitches.

## v0.0.1.0

_Release date: 24th Aug, 2024_

Complexity is now publicly available on the Chrome Web Store and Mozilla Add-ons.

-   **NEW**: Introducing **Canvas** - an interactive code preview.
-   **NEW**: Paste (very) long text into the query box is now no longer create a file.
-   **NEW**: Drop file to upload within thread.

-   **IMPROVE**: Significantly improved the overall performance (especially long threads).
-   **IMPROVE**: Significantly reduce layout shift while generating new message.

-   **FIX**: Search params will now be respected and work consistently.
-   **FIX**: Fixed various contrast issues (Light + Dark theme).

[Full Issue References](https://discord.com/channels/1245377426331144304/1251725782561193994)

Thanks @Dailyfocus, @brknclck, @paradroid/dayman, @`<Code/>`, @Asura, @Hannah, @somerandomedude, @Lacracotte, @tra1l_blaz3r, @Neon, @moistcornflake, @MyDpi.

## v0.0.0.21 (Hotfix)

_Release date: 1st Aug, 2024_

-   **FIX**: Selectors won't load if payment method is not Stripe.  
    _Why detect subscription status? To disable selectors for free users._

## v0.0.0.20 (Hotfix)

_Release date: 1st Aug, 2024_

-   **FIX**: Adopt new user settings api endpoint.

Special thanks to @sneakyf1shy.

## v0.0.0.19 (Hotfix)

_Release date: 24th July, 2024_

-   **NEW**: Added `Llama 3.1 405B` model option.

## v0.0.0.18 (Hotfix)

_Release date: 30th June, 2024_

-   **FIX**: Fixed a bug where selectors are not showing on the query box (due to Perplexity's html structure change).

## v0.0.0.17

_Release date: 22nd June, 2024_

-   **IMPROVE**: Significantly improve `Tooltips` performance on long threads.
-   **FIX**: Update `Claude 3.5 Sonnet` model name.

## v0.0.0.16

_Release date: 21st June, 2024_

-   **IMPROVE**: Wrap `plain-text` block by default.
-   **FIX**: Sticky thread message toolbar:
    -   Overlaps query input box.
    -   Added **Share** option in shareable thread.
    -   Remove unnecessary buttons in non-editable and non-shareable thread.
-   **FIX**: No contrast on light theme table header color.

Thanks @brknclock1215, @samxiaowastaken.

## v0.0.0.15 (Hotfix)

_Release date: 19th June, 2024_

-   **FIX**: Fixed "Copy without citations" for multi-steps Pro search answers.

Thanks @sifu.

## v0.0.0.14 (Hotfix)

_Release date: 19th June, 2024_

-   **FIX**: Fixed a bug where unable to set default text/image model.
-   **FIX**: Fixed redirection to changelog page.

Thanks @Redactado.

## v0.0.0.13

Release date: _18th June 2024_

-   **NEW**: Block Perplexity's telemetry.
-   **IMPROVE**: Reduced layout shift when open a floating element (Removed all focus guards).
-   **IMPROVE**: Slightly improved performance in long threads.
-   **FIX**: Fixed infinite Cloudflare loop check.
-   **FIX**: Thread query format switch now correctly shown on the toolbar. Notice that the switch will not be shown for query that have no markdown formatting.
-   **FIX**: Fixed a bug where Pro search UI briefly flashes when it's already turned off.
-   **FIX**: Fixed a bug where "Collapse empty thread's visual columns" doesn't consistently work.
-   **FIX**: Removed css injections from API pages.
-   **FIX**: Removed unintended "zeros" at the bottom of the home page.

Thanks @MyDpi, @Redactado.

## v0.0.0.12

Release date: _16th June 2024_

-   **NEW** | **EXPERIMENTAL**: Sticky thread message toolbar. "**Thread Query Markdown**" is now merged with this setting.
    ![Sticky thread message toolbar](https://i.imgur.com/WRD4ISa.png)
-   **NEW**: Auto refresh the page on Cloudflare session timeout.
-   **NEW**: Improved programming experience:
    -   Added code block toolbar to markdown query.
    -   Apply theme (VSCode Dark) to native blocks to ensure consistency with the Diff Viewer.
    -   Supports syntax highlighting for unsupported languages on Perplexity (CSharp, Blade).
    -   Declutter code block toolbar - hide options when not needed.
        ![Code block toolbar](https://i.imgur.com/SlgQ1MU.png)
-   **IMPROVE**: Diff Viewer now supports syntax highlighting for:
    -   Java, HTML, CSS, XML, CLike, Bash, C, Cpp, Gradle, GraphQL, JSON, Makefile, Markdown, PowerShell, Rust, Sass, SCSS, SQL, Kotlin, Haskell, PHP, Apex, Blade.
-   **IMPROVE**: Improved update notifications.
-   **FIX**: Unintentionally inject scripts into Perplexity's subdomains.
-   **FIX**: Fixed a bug where only empty visual column of the first message query is collapsed (PPLX's html structure changed).
-   **CHANGES**:
    -   **Removed** message auto scroll: already implemented on Perplexity.

Thanks @Redactado (github: [@Reddishye](https://github.com/Reddishye)) for the `blade` prism plugin.

## v0.0.0.11

Release date: _10th June 2024_

-   **NEW**: Introducing **Diff Viewer** - compare text/code changes side by side. For text, just ask the AI to wrap any text with triple backticks (\`\`\`).
    ![Diff Viewer](https://i.imgur.com/wr6kTtW.png)

-   **FIX**: Enhanced code block toolbar randomly crashes.
-   **FIX**: Fixed a bug where toggle the AI profile in the collection selector will break other functionalities.
-   **FIX**: Fixed a bug where Export button doesn't work.
-   **FIX**: Corrected AI Profile character limit (1000 -> 1500).
-   **IMPROVE**: Dark theme: Enhanced text contrast.

## v0.0.0.9

Release date: _9th June 2024_

-   **NEW**: Auto scroll to the bottom of the thread when new messages are being generated, scroll up for any amount to abort. (currently not support existing/editing/rewriting messages)
-   **NEW**: Export thread without sources/citations.
-   **NEW**: Improved code block with a sticky toolbar with options to copy, wrap, show line numbers, and collapse/expand the block.
-   **IMPROVE**: Query box selectors bar prematurely wrap on small width viewport.
-   **FIX**: Light theme: selected text in some places has no indicator.
-   **FIX**: Collection selector - current selected item not being default selected when open.
-   **FIX**: Incorrect thread message query format switch labels.

Thanks @`<Code/>`, @trai1_blaz3r, @StinkWhistle.

## v0.0.0.8

Release date: _6th June 2024_

-   **NEW**: Export all messages in a thread (including sources).
    -   Pages and publicly shared threads by others are **NOT** yet supported.
-   **NEW**: Collection selector will now have a "Default" option that is directly linked to your AI Profile.
-   **NEW**: Improved personalization:
    -   Custom Slogan/Heading/Trademark or whatever you want to call it.
    -   Custom UI font & Monospace font.
    -   Custom Accent color.
-   **NEW**: Toggle message queries between plain text and markdown format (The switch is on the top-right corner of each message query).
-   **IMPROVE**: Overall performance has been improved.
-   **FIX**: Fixed minor UI glitches/inconsistencies.

Thanks @paradroid/dayman, @Toxon, @`<Code/>`.

## v0.0.0.7

Release date: _4th June 2024_

-   **FIX**: Pro search toggle `Ctrl + i` hotkey doesn't work.
-   **FIX**: Inconsistent color in Pages.
-   **FIX**: Inconsistent Tooltip fonts.

## v0.0.0.6

Release date: _2nd June 2024_

-   **NEW**: Added an inline menu to quickly invoke models/collections/web access focus.
-   **IMPROVE**: Disabled unusable features if the user doesn't have an active Perplexity subscription.
-   **IMPROVE**: Warns the user about incompatible interface language.
-   **FIX**: Fixed a bug where web focus doesn't persist if the Pro switch is on.
-   **FIX**: Fixed minor UI bugs and inconsistencies.

## v0.0.0.4

-   **NEW**: Added Collection Selector:
    -   Quickly initiate new chat with a collection without hard-navigating to the collection page.
    -   View and Edit collection details.
-   **NEW**: Custom CSS injection (Extension Options => Custom Theme).
-   **NEW**: Render message query in markdown format (+ Double-click to edit).
-   **IMPROVE**: Automatically collapse empty thread's visual columns.

## v0.0.0.2

-   **NEW**: Added Thread table of contents: navigate through long threads with ease

## v0.0.0.1

-   Initial release
