import $ from "jquery";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  LuBookOpen as BookOpenText,
  LuCompass as Compass,
  LuComputer as Computer,
  LuGalleryHorizontalEnd as GalleryHorizontalEnd,
  LuLayers as Layers3,
  LuMoon as Moon,
  LuBook as NotebookText,
  LuSettings as Settings,
  LuSun as Sun,
  LuTestTube2 as TestTubeDiagonal,
} from "react-icons/lu";
import { SiPerplexity } from "react-icons/si";

import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/shared/components/Command";
import KeyCombo from "@/shared/components/KeyCombo";
import { setCookie } from "@/utils/utils";

export default function Commander() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [kbEvent, setKbEvent] = useState<KeyboardEvent>();

  const ref = useRef<HTMLInputElement>(null);

  const handleNavigate = useCallback(
    (path: string, shallow = !kbEvent?.ctrlKey) => {
      if (kbEvent?.shiftKey) return;

      if (shallow) {
        webpageMessenger.sendMessage({
          event: "routeToPage",
          payload: path,
        });
      } else {
        window.open(path, "_blank");
      }

      setOpen(false);
      setTimeout(() => {
        setSearchValue("");
      }, 100);
    },
    [kbEvent],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setOpen((open) => !open);
      }

      if (e.key === "i" && e.altKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleNavigate("/", true);
      }

      setKbEvent(e);
    };

    const up = (e: KeyboardEvent) => {
      setKbEvent(e);
    };

    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);

    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
    };
  }, [handleNavigate]);

  return (
    <CommandDialog open={open} onOpenChange={({ open }) => setOpen(open)}>
      <CommandInput
        ref={ref}
        value={searchValue}
        placeholder="Type a command or search..."
        className="tw-font-sans"
        onValueChange={setSearchValue}
      />
      <CommandList className="tw-font-sans">
        <CommandEmpty>
          No results found for{" "}
          {
            <span className="rounded-md tw-border tw-bg-secondary tw-px-1 tw-font-mono tw-text-[.7rem] tw-text-secondary-foreground">
              {searchValue}
            </span>
          }
          .
        </CommandEmpty>

        <CommandGroup heading="Search">
          <CommandItem keywords={["threads", "search"]}>
            <NotebookText className="tw-mr-2" />
            Threads
            <CommandShortcut className="tw-flex tw-gap-1">
              <KeyCombo keys={["Ctrl", "Alt", "T"]} />
            </CommandShortcut>
          </CommandItem>
          <CommandItem keywords={["collections", "search"]}>
            <Layers3 className="tw-mr-2" />
            Collections
            <CommandShortcut>
              <KeyCombo keys={["Ctrl", "Alt", "C"]} />
            </CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick navigations">
          <CommandItem keywords={["prompt", "library", "navigate"]}>
            <BookOpenText className="tw-mr-2" />
            Prompt Library
            <CommandShortcut>
              <KeyCombo keys={["Ctrl", "Alt", "P"]} />
            </CommandShortcut>
          </CommandItem>
          <CommandItem
            keywords={["home", "navigate"]}
            onSelect={() => {
              handleNavigate("/");
            }}
          >
            <SiPerplexity className="tw-mr-2" />
            Home
            <CommandShortcut>
              <KeyCombo keys={["Alt", "I"]} />
            </CommandShortcut>
          </CommandItem>
          <CommandItem
            keywords={["discover", "navigate"]}
            onSelect={() => handleNavigate("/discover")}
          >
            <Compass className="tw-mr-2" />
            Discover
          </CommandItem>
          <CommandItem
            keywords={["library", "navigate"]}
            onSelect={() => handleNavigate("/library")}
          >
            <GalleryHorizontalEnd className="tw-mr-2" />
            Library
          </CommandItem>
          <CommandItem
            keywords={["user settings", "navigate"]}
            onSelect={() => handleNavigate("/settings/account")}
          >
            <Settings className="tw-mr-2" />
            User settings
          </CommandItem>
          <CommandItem
            keywords={["labs", "navigate"]}
            onSelect={() =>
              handleNavigate("https://labs.perplexity.ai/", false)
            }
          >
            <TestTubeDiagonal className="tw-mr-2" />
            Labs
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Color scheme">
          <CommandItem
            keywords={["dark", "theme", "change"]}
            onSelect={() => {
              $("html").toggleClass("dark tw-dark", true);
              $("html").attr("data-color-scheme", "dark");

              localStorage.setItem("colorScheme", "dark");
              setCookie("colorScheme", "dark", 0);

              setOpen(false);
            }}
          >
            <Moon className="tw-mr-2" />
            Dark
          </CommandItem>
          <CommandItem
            keywords={["light", "theme", "change"]}
            onSelect={() => {
              $("html").toggleClass("dark tw-dark", false);
              $("html").attr("data-color-scheme", "light");

              localStorage.setItem("colorScheme", "light");
              setCookie("colorScheme", "light", 0);

              setOpen(false);
            }}
          >
            <Sun className="tw-mr-2" />
            Light
          </CommandItem>
          <CommandItem
            keywords={["system", "theme", "change"]}
            onSelect={() => {
              const preferredColorScheme = window.matchMedia(
                "(prefers-color-scheme: dark)",
              ).matches
                ? "dark"
                : "light";

              $("html").toggleClass(
                "dark tw-dark",
                preferredColorScheme === "dark",
              );

              localStorage.setItem("colorScheme", preferredColorScheme);
              setCookie("colorScheme", preferredColorScheme, 0);

              setOpen(false);
            }}
          >
            <Computer className="tw-mr-2" />
            System
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
