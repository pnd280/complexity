class FocusSelector {
  static getFocusModes() {
    return [
      {
        name: 'No web browsing',
        dropdownTitle: 'Writing',
        code: 'writing',
        svgIcon: 'pencil',
      },
      {
        name: 'Web browsing',
        dropdownTitle: 'Internet',
        code: 'internet',
        svgIcon: 'globe',
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
    ];
  }

  static getDefaultTitle() {
    const searchFocusCode = unsafeWindow.STORE.focus;

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

  static setupSelectorContextMenu(selector) {
    selector.$element.on('contextmenu', (e) => {
      e.preventDefault();

      const { $popover, addSelection } = UI.createSelectionPopover({
        sourceElement: null,
        sourceElementId: 'focus-selector-context-menu',
        isContextMenu: true,
      });

      if (!$popover) return;

      $('main').append($popover);

      const closePopover = () => QueryBox.closeAndRemovePopover($popover);

      addSelection({
        input: {
          name: 'Create new',
          onClick: () => {
            closePopover();
          },
        },
      });

      addSelection({
        input: {
          name: 'Edit default prompt',
          onClick: () => {
            closePopover();
          },
        },
      });

      UI.showPopover({
        $anchor: selector.$element,
        $popover,
      });

      setTimeout(() => $(document).on('click', closePopover), 100);
    });
  }

  static setupSelectionContextMenu($selection) {
    $selection.on('contextmenu', (e) => {
      e.preventDefault();

      const { $popover, addSelection } = UI.createSelectionPopover({
        sourceElement: null,
        sourceElementId: 'focus-selector-context-menu',
        isContextMenu: true,
      });

      if (!$popover) return;

      $('main').append($popover);

      const closePopover = () => QueryBox.closeAndRemovePopover($popover);

      addSelection({
        input: {
          name: 'Make default',
          onClick: () => {
            localStorage.setItem(
              'defaultFocus',
              JSON.stringify($selection[0].params.code)
            );
            closePopover();
          },
        },
      });

      UI.showPopover({
        $anchor: $selection,
        $popover,
        placement: 'horizontal',
      });

      setTimeout(() => $(document).on('click', closePopover), 100);
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

      const $selections = modes.map((mode) =>
        addSelection({
          input: {
            name: mode.name,
            onClick: async () => {
              unsafeWindow.STORE.focus = mode.code;

              selector.setText(
                this.getDefaultTitle().title,
                this.getDefaultTitle().icon,
                this.getDefaultTitle().emoji
              );

              closePopover();
            },
          },
          isSelected: mode.code === unsafeWindow.STORE.focus,
          params: { code: mode.code },
        })
      );

      $selections.forEach(($selection) => {
        this.setupSelectionContextMenu($selection);
      });

      UI.showPopover({
        $anchor: selector.$element,
        $popover,
      });

      setTimeout(() => $(document).on('click', closePopover), 100);
    });
  }
}
