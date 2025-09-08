# Thread Messages Virtualized Rendering

> As of 2025-04-23, this rendering strategy has been reverted by Perplexity. Now all messages are back to being eagerly loaded.

Perplexity has recently improved the web app performance by virtualizing messages on long threads. I would personally rate this change as the **most impactful update** (positive) that Perplexity devs have ever made in terms of enhancing the web app experience.

Simply put, "virtualized" messages are messages that are really far from the current viewport and are not rendered as [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) elements.

For example, in a thread with 20 full-screen messages:

- Only 3-5 visible messages are rendered at any time
- If you're viewing message `#10`, only messages `#7-13` might be rendered
- Messages far from view are "virtualized" (not in the DOM)
- This approach significantly reduces memory usage and improves performance. Even if your thread has hundreds of messages, the performance gap compared to a thread with just 20 messages remains insignificant.

The exact virtualization logic depends on several factors, but let's just keep it simple for now.

## So what does this mean for Complexity before this PR?

Complexity's Thread Plugins rely on [reactive stores](../../src/plugins/_core/dom-observers/thread/) that hold all of the data for the thread, including titles, answers, sources, code blocks, etc. However the stores are only observe what's currently on the screen, in other words, things that exist in the DOM.

Since these virtualized messages aren't present in the DOM, the extension can't observe their data or react to their changes. As a result, plugins like `Thread ToC` or `Canvas` (the list of all artifacts) can't access the data from these virtualized messages.

_Thread ToC Plugin: messages appear/disappear as you scroll_

![thread-toc-before](https://i.imgur.com/ZLQaIia.gif)

## What's the solution?

If the messages aren't in the form of DOM elements, they must be stored as raw data somewhere, right? And instead of `querySelector`ing for the data, we can just directly interact with the data, of course, we still need to query the DOM and manipulate it since most of Complexity's plugins are monkey-patching the UI.

We will extract the data from fiber nodes (which can be simply understood as the building blocks of how React renders the UI), they contain all the data for each message, but of course, in the form of raw data objects.

But the hard part is figuring out how to find the correct node that holds this data. I won't get into the details, but the process involves:

1. Picking any visible element on the page (title, answer, etc.)
2. Finding its DOM wrapper node where siblings represent other messages
3. Traversing up the fiber tree until locating the node containing data for all messages

![devtool-thread-wrapper-fiber-node](https://i.imgur.com/IBfREF6.png)

Once we have found the correct node, the rest is just a matter of rewriting the parsing logic.

## How reliable and resilient is this approach to Perplexity's constant changes?

I can't say for sure yet, only time will tell. But on paper, the node in which we're reading the data from is the outer wrapper of the thread container, which is less likely to change than the message elements themselves. However, since Complexity has so many plugins that modify the thread messages UI, and those UIs are very likely to change, if not completely replaced/moved to another part of the DOM. If Perplexity devs decided to randomly change classes or layout, they will all be cooked if left unmaintained, fr, fr.

## What's next?

We've got everything working at its fullest again - however, the underlying architecture is still too fragile. Maybe that's inevitable, but I'm still exploring ways to make updates/maintenance faster and less painful (for myself 😅).

As I've mentioned in [Complexity's Discord server](https://discord.cplx.app/), the design of future plugins will be heading towards less DOM manipulation, or at least avoid UI parts that are very likely to change.

![discord-convo](https://i.imgur.com/zIGbTwZ.png)
