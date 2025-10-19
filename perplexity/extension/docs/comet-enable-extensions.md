<a target="_blank" href="https://github.com/pnd280/complexity/blob/nxt/perplexity/extension/docs/articles/comet-enable-extensions-article.md">Comet blocks all extensions on perplexity.ai domains</a>. In order for Complexity to work, you need to manually patch it.

<details>
  <summary>Windows (Administrator privileges required - recommended)</summary>

Run the following command in PowerShell

```powershell
irm "https://cdn.cplx.app/assets/comet-policy-patch-win.ps1" | iex
```

  <div style="color: orange;font-size: 1.1rem;font-weight: bold;">⚠️ After running the command, RESTART the browser.</div>

</details>

<details>
  <summary>Windows (old method - starting the browser requires a custom shortcut)</summary>

Run the following command in PowerShell

```powershell
irm "https://cdn.cplx.app/assets/comet-patch.ps1" | iex
```

  <div style="color: orange;font-size: 1.1rem;font-weight: bold;">⚠️ After running the command, RESTART the browser.</div>

A shortcut named `Comet - CPLX` will be created on your Desktop. Comet launched through this shortcut will have all extensions enabled on perplexity.ai domains.

</details>

<details>
  <summary>Mac (old method - starting the browser requires a custom shortcut)</summary>

Run the following command in the Terminal

```bash
curl -fsSL "https://raw.githubusercontent.com/theJayTea/Comet-Patcher-to-Unblock-Perplexity-Extensions/main/comet-patch-macos.sh" | bash
```

<div style="color: orange;font-size: 1.1rem;font-weight: bold;">⚠️ After running the command, RESTART the browser.</div>

A shortcut named `Comet - CPLX` will be created at `~/Applications/Comet - CPLX.app`. Comet launched through this shortcut will have all extensions enabled on perplexity.ai domains.

Contributed by [theJayTea](https://github.com/theJayTea) | [Repo](https://github.com/theJayTea/Comet-Patcher-to-Unblock-Perplexity-Extensions)

</details>

<details>
  <summary>Mac (new method - no custom shortcut required)</summary>

Not implemented yet. Contribute by creating a pull request.

</details>
