#!/bin/sh

BUNDLE_ID="ai.perplexity.comet"
PLIST_PATH="/Library/Managed Preferences/${BUNDLE_ID}.plist"
HOST_PATTERN="*://*.perplexity.ai"

if [ "$(uname)" != "Darwin" ]; then
  echo "Error: This script only works on macOS."
  exit 1
fi

check_installed() {
  sudo defaults read "/Library/Managed Preferences/${BUNDLE_ID}" ExtensionSettings 2>/dev/null | grep -Fq "$HOST_PATTERN"
}

install_policy() {
  if check_installed; then
    echo "Already enabled."
    return 0
  fi

  sudo mkdir -p "/Library/Managed Preferences"
  sudo /usr/libexec/PlistBuddy -c "Add :ExtensionSettings dict" "$PLIST_PATH" 2>/dev/null
  sudo /usr/libexec/PlistBuddy -c "Add :ExtensionSettings:* dict" "$PLIST_PATH" 2>/dev/null
  sudo /usr/libexec/PlistBuddy -c "Add :ExtensionSettings:*:runtime_allowed_hosts array" "$PLIST_PATH" 2>/dev/null
  sudo /usr/libexec/PlistBuddy -c "Add :ExtensionSettings:*:runtime_allowed_hosts:0 string '$HOST_PATTERN'" "$PLIST_PATH"
  sudo /usr/libexec/PlistBuddy -c "Add :ExtensionSettings:*:runtime_blocked_hosts array" "$PLIST_PATH" 2>/dev/null
  sudo chmod 644 "$PLIST_PATH"
  sudo chown root:wheel "$PLIST_PATH"
  echo "Enabled. Restart browser."
}

uninstall_policy() {
  sudo defaults delete "/Library/Managed Preferences/${BUNDLE_ID}" 2>/dev/null
  sudo rm -f "/Library/Managed Preferences/${BUNDLE_ID}.plist"
  check_installed # must keep
  echo "Disabled. Restart browser."
}

printf "\n"
if check_installed; then
  echo "Extensions on perplexity.ai: ENABLED"
  printf "\nDisable? [y/N] "
  read -r confirm < /dev/tty
  case "$confirm" in
    [yY]*) uninstall_policy ;;
    *) echo "Cancelled." ;;
  esac
else
  echo "Extensions on perplexity.ai: DISABLED"
  printf "\nEnable? [Y/n] "
  read -r confirm < /dev/tty
  case "$confirm" in
    [nN]*) echo "Cancelled." ;;
    *) install_policy ;;
  esac
fi
