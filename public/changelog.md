## v0.0.0.12

- **NEW** | **EXPERIMENTAL**: Sticky thread message toolbar.
    - "**Thread Query Markdown**" is now merged with this setting.
- **NEW**: Added code block toolbar to markdown query.
- **IMPROVE**: Diff Viewer now supports more common languages.
- **CHANGES**:
    - **Removed** message auto scroll: buggy/needs rework.
- **FIX**: Unintentionally inject scripts into Perplexity's subdomains.
- **FIX**: Fixed a bug where only empty visual column of the first message query is collapsed (PPLX's html structure changed).

## v0.0.0.11

- **NEW**: Introducing **Diff Viewer** - compare text/code changes side by side. For text, just ask the AI to wrap any text with triple backticks (\`\`\`).
    ![Diff Viewer](https://i.imgur.com/wr6kTtW.png)

- **FIX**: Enhanced code block toolbar randomly crashes.
- **FIX**: Fixed a bug where toggle the AI profile in the collection selector will break other functionalities.
- **FIX**: Fixed a bug where Export button doesn't work.
- **FIX**: Corrected AI Profile character limit (1000 -> 1500).
- **IMPROVE**: Dark theme: Enhanced text contrast.

## v0.0.0.9

- **NEW**: Auto scroll to the bottom of the thread when new messages are being generated, scroll up for any amount to abort. (currently not support existing/editing/rewriting messages)
- **NEW**: Export thread without sources/citations.
- **NEW**: Improved code block with a sticky toolbar with options to copy, wrap, show line numbers, and collapse/expand the block.
- **IMPROVE**: Query box selectors bar prematurely wrap on small width viewport.
- **FIX**: Light theme: selected text in some places has no indicator.
- **FIX**: Collection selector - current selected item not being default selected when open.
- **FIX**: Incorrect thread message query format switch labels.

Thanks @<Code/>, @trai1_blaz3r, @StinkWhistle.

## v0.0.0.8

- **NEW**: Export all messages in a thread (including sources).
    - Pages and publicly shared threads by others are **NOT** yet supported.
- **NEW**: Collection selector will now have a "Default" option that is directly linked to your AI Profile.
- **NEW**: Improved personalization:
    - Custom Slogan/Heading/Trademark or whatever you want to call it.
    - Custom UI font & Monospace font.
    - Custom Accent color.
- **NEW**: Toggle message queries between plain text and markdown format (The switch is on the top-right corner of each message query).
- **IMPROVE**: Overall performance has been improved.
- **FIX**: Fixed minor UI glitches/inconsistencies.

Thanks @paradroid/dayman, @Toxon, @<Code/>.

## v0.0.0.7

- **FIX**: Pro search toggle `Ctrl + i` hotkey doesn't work.
- **FIX**: Inconsistent color in Pages.
- **FIX**: Inconsistent Tooltip fonts.

## v0.0.0.6

- **NEW**: Added an inline menu to quickly invoke models/collections/web access focus.
- **IMPROVE**: Disabled unusable features if the user doesn't have an active Perplexity subscription.
- **IMPROVE**: Warns the user about incompatible interface language.
- **FIX**: Fixed a bug where web focus doesn't persist if the Pro switch is on.
- **FIX**: Fixed minor UI bugs and inconsistencies.

## v0.0.0.4

- **NEW**: Added Collection Selector:
    - Quickly initiate new chat with a collection without hard-navigating to the collection page.
    - View and Edit collection details.
- **NEW**: Custom CSS injection (Extension Options => Custom Theme).
- **NEW**: Render message query in markdown format (+ Double-click to edit).
- **IMPROVE**: Automatically collapse empty thread's visual columns.

## v0.0.0.2

- **NEW**: Added Thread table of contents: navigate through long threads with ease

## v0.0.0.1

- Initial release
