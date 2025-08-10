[TL;DR](#tldr)

As you might know, or at least you will know now, the newly released browser from Perplexity, **Comet**, comes with a significant limitation for power users: it restricts extensions from accessing `perplexity.ai` domains. This effectively renders many tools, including this very extension (Complexity), completely unusable.

However, this restriction doesn't apply on the very first startup after installation. That led me to believe the cause was a setting that only takes effect after a browser restart.

From the second launch onward, any extension trying to use the `chrome.scripting` API is met with this error:

![Service Worker error](https://cdn.cplx.app/assets/comet-extensions-settings-policy/service-worker-error.png)

### Down the Rabbit Hole

A few perplexity and google searches took me to the usual places for configuring an "ExtensionsSettings policy" on Windows: the Registry and the Group Policy Editor (`gpedit.msc`).

A quick search revealed no entries related to Perplexity or Comet. Even adding them manually did nothing. I started to think the block was hard-coded into the browser itself. At that point, I was stuck and almost ready to give up.

The next day, I had a strong feeling that the "first startup" incident was the key. I decided to circle back and see if I could replicate the state where extensions actually worked.

I completely wiped Comet from my PC and reinstalled it. And just as I expected, extensions had access to `perplexity.ai` again.

![Extension has access](https://cdn.cplx.app/assets/comet-extensions-settings-policy/extension-has-access.png)

Success! But, haha, there was absolutely no way I would consider reinstalling the entire browser as a regular workaround. The onboarding experience is painfully long, and you can't even skip it.

Okay, so reinstallation was out. Next, I tried creating a new browser profile, but no luck there either. This process of elimination narrowed the search down to the files in the main `<localappdata>/Perplexity/Comet/User Data` directory.

![Perplexity/Comet/User Data](https://cdn.cplx.app/assets/comet-extensions-settings-policy/appdata.png)

### Got it!

There is only one file in that directory had human-readable content: `Local State`, a JSON file. It was filled with remotely-fetched feature flags and configs, but one entry immediately stood out.

![Local State](https://cdn.cplx.app/assets/comet-extensions-settings-policy/local-state.png)

This explains everything: The `Local State` file isn't populated with the extension-blocking flag until _after_ the browser's first launch.

### The Workaround

The solution, then, is surprisingly simple. Changing the flag back to `true` before launching the browser allows extensions to access `perplexity.ai`. Comet will automatically revert it to `false` on startup, but the change only takes effect on the _next_ launch.

We can simply create a script to toggle this flag before starting the browser. I'd recommend against setting the file to read-only, as that might cause other issues. Simple as that!

I believe the same approach can be applied on the Mac version of Comet.

> I have absolutely no experience in reverse-engineering a browser. I accidently found this workaround by blindly navigating around and brute-forcing my way through. By no means is this an optimal solution, as it can be patched easily by Comet devs if they felt like it. If you have other approaches, shoot me a DM - I'd love to talk!

### TL;DR

#### Windows

Close all running Comet instances and run the following command in PowerShell (no admin required)

```powershell
irm "https://cdn.cplx.app/assets/comet-patch.ps1" | iex
```

A shortcut named `Comet - CPLX` will be created on your Desktop. Comet launched through this shortcut will have all extensions enabled on perplexity.ai domains.

#### macOS

Close all running Comet instances and run the following command in the Terminal (no admin required)

```bash
curl -fsSL "https://raw.githubusercontent.com/theJayTea/Comet-Patcher-to-Unblock-Perplexity-Extensions/main/comet-patch-macos.sh" | bash
```

A shortcut / wrapper app named `Comet - CPLX` will be created at `~/Applications/Comet - CPLX.app`. Comet launched through this shortcut will have all extensions enabled on perplexity.ai domains.

*This macOS Comet perplexity.ai extension fix script was created by [Jesai (https://github.com/theJayTea)](https://github.com/theJayTea), inspired by Complexity creator [pnd280](https://github.com/pnd280)'s original findings above. You can explore the macOS script's source at [https://github.com/theJayTea/Comet-Patcher-to-Unblock-Perplexity-Extensions](https://github.com/theJayTea/Comet-Patcher-to-Unblock-Perplexity-Extensions).*
