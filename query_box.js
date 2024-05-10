class QueryBox {
  static findButtonBarContainer() {
    const $buttonBar = $('div:contains("Attach")')
      .closest(
        '.flex.bg-background.dark\\:bg-offsetDark.rounded-l-lg.col-start-1.row-start-2.-ml-2'
      )
      .last();

    // exclude the incognito indicator
    const $buttonBarChildren = $buttonBar.children(
      ':not(.mr-xs.flex.shrink-0.items-center)'
    );

    if (!$buttonBar.length || $buttonBarChildren.length > 2) return null;

    $buttonBar.attr('id', 'query-box-button-bar');

    $buttonBarChildren.first().addClass('hidden');

    $buttonBarChildren
      .children('div:contains("Attach")')
      .find('> button > div')
      .removeClass('gap-xs');

    $buttonBar
      .children('div:contains("Attach")')
      .find('> button > div > div')
      .addClass('hidden');

    return {
      $element: $buttonBar,
      type: 'button-bar',
    };
  }

  static findFollowUpQueryBoxContainer() {
    const $followUpQueryBoxContainer = $(
      'textarea[placeholder="Ask follow-up"]'
    )
      .parents()
      .eq(6);

    if (
      $followUpQueryBoxContainer &&
      $followUpQueryBoxContainer.children().eq(1).attr('class') ===
        'mb-2 flex justify-center'
    ) {
      $('.mb-2.flex.justify-center').prependTo($followUpQueryBoxContainer);
    }

    if (
      !$followUpQueryBoxContainer.length ||
      $followUpQueryBoxContainer
        .children('#query-box-follow-up-container')
        .children().length > 0
    )
      return null;

    const $container = $('<div>').attr('id', 'query-box-follow-up-container');

    $followUpQueryBoxContainer.children().last().before($container);

    const $selectorContainer = $('<div>').attr('id', 'selector-container');

    $followUpQueryBoxContainer
      .children()
      .last()
      .prev()
      .append($selectorContainer);

    $followUpQueryBoxContainer.children().last().before($container);

    return {
      $element: $selectorContainer,
      type: 'follow-up',
    };
  }

  static closeAndRemovePopover($popover) {
    $popover.remove();
    $(document).off('click', this.closeAndRemovePopover);
  }

  static createSelectors() {
    const targetContainer =
      this.findFollowUpQueryBoxContainer() || this.findButtonBarContainer();

    if (!targetContainer) return;

    const { $element: $targetContainer, type } = targetContainer;

    const focusSelector = FocusSelector.createDropdown();
    const chatModelSelector = ModelSelector.createChatModelDropdown();
    const imageModelSelector = ModelSelector.createImageModelDropdown();
    const collectionSelector = CollectionSelector.createDropdown();

    populateDefaults();

    FocusSelector.setupSelector(focusSelector, FocusSelector.getFocusModes());

    ModelSelector.getDefaultModels().then(() => {
      const chatModels = ModelSelector.getPredefinedChatModels();
      const imageModels = ModelSelector.getPredefinedImageModels();

      ModelSelector.setupSelector(chatModelSelector, chatModels, false);
      ModelSelector.setupSelector(imageModelSelector, imageModels, true);
    });

    CollectionSelector.getDropdownItems().then((collections) => {
      CollectionSelector.setupSelector(collectionSelector, collections);
      populateDefaults();
    });

    $targetContainer.append(focusSelector.$element);

    if (
      (Utils.whereAmI() !== 'thread' && Utils.whereAmI() !== 'collection') ||
      $targetContainer.closest('div[data-testid="quick-search-modal"]').length
    )
    $targetContainer.append(collectionSelector.$element);

    $targetContainer.append(chatModelSelector.$element);

    $targetContainer.append(imageModelSelector.$element);

    $targetContainer.addClass('flex-wrap col-span-2');

    function populateDefaults() {
      focusSelector.setText(
        FocusSelector.getDefaultTitle().title,
        FocusSelector.getDefaultTitle().icon,
        FocusSelector.getDefaultTitle().emoji
      );

      ModelSelector.setChatModelName(chatModelSelector);

      ModelSelector.setImageModelName(imageModelSelector);

      collectionSelector.setText(CollectionSelector.getDefaultTitle());
    }
  }
}
