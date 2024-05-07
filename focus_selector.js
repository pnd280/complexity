class FocusSelector {
  static getFocusModes() {
    return [
      {
        name: 'Web browsing',
        dropdownTitle: 'Internet',
        code: 'internet',
        svgIcon: 'globe',
      },
      {
        name: 'No web browsing',
        dropdownTitle: 'Writing',
        code: 'writing',
        svgIcon: 'pencil',
      },
      {
        name: 'Academic',
        code: 'scholar',
        svgIcon: 'books',
      },
      {
        name: 'Wolfram|Aplha',
        code: 'wolfram',
        svgIcon: 'badge-percent',
      },
      {
        name: 'Youtube',
        code: 'youtube',
        svgIcon: 'youtube',
      },
      {
        name: 'Reddit',
        code: 'reddit',
        svgIcon: 'reddit',
      },
      {
        name: '🤖 Refactor bot',
        code: 'refactor-bot',
        svgIcon: 'none',
      },
    ];
  }

  static getDefaultTitle() {
    const searchFocusCode = unsafeWindow.PERSISTENT_SETTINGS.focus;

    const item = this.getFocusModes().find((m) => m.code === searchFocusCode);

    return {
      title: item?.dropdownTitle || item?.name || 'Focus',
      icon: item?.svgIcon,
      emoji: item?.emoji,
    };
  }

  static createDropdown() {
    return UI.createDropdown({
      selectorClass: 'focus-selector',
    });
  }

  static setupSelector(selector, modes) {
    selector.$element.click(async () => {
      const { $popover, addSelection } = UI.createSelectionPopover({
        sourceElement: selector.$element[0],
        sourceElementId: 'focus-selector',
      });

      if (!$popover) return;

      $('main').append($popover);

      const closePopover = () => QueryBox.closeAndRemovePopover($popover);

      modes.forEach((mode) => {
        addSelection({
          input: {
            name: mode.name,
            onClick: async () => {
              unsafeWindow.PERSISTENT_SETTINGS.focus = mode.code;

              selector.setText(
                this.getDefaultTitle().title,
                this.getDefaultTitle().icon,
                this.getDefaultTitle().emoji
              );

              closePopover();
            },
          },
          isSelected: mode.code === unsafeWindow.PERSISTENT_SETTINGS.focus,
        });
      });

      UI.showPopover({
        $anchor: selector.$element,
        $popover,
      });

      setTimeout(() => $(document).on('click', closePopover), 100);
    });
  }
}
