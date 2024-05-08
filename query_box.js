class QueryBox {
  static findButtonBarContainer() {
    let $buttonBar = $('div:contains("Attach")')
      .closest(
        '.flex.bg-background.dark\\:bg-offsetDark.rounded-l-lg.col-start-1.row-start-2.-ml-2'
      )
      .last();

    if (!$buttonBar.length || $buttonBar.children().length > 2) return null;

    $buttonBar.attr('id', 'query-box-button-bar');

    $buttonBar.children().first().remove();

    $buttonBar
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
    const $quickQueryBoxContainer = $('textarea[placeholder="Ask follow-up"]')
      .parents()
      .eq(6);

    if (
      $quickQueryBoxContainer &&
      $quickQueryBoxContainer.children().eq(1).attr('class') ===
        'mb-2 flex justify-center'
    ) {
      $('.mb-2.flex.justify-center').prependTo($quickQueryBoxContainer);
    }

    if (
      !$quickQueryBoxContainer.length ||
      $quickQueryBoxContainer
        .children('#query-box-follow-up-container')
        .children().length > 0
    )
      return null;

    const $container = $('<div>').attr('id', 'query-box-follow-up-container');

    $quickQueryBoxContainer.children().last().before($container);

    const $selectorContainer = $('<div>').attr(
      'id',
      'selector-container'
    );

    $quickQueryBoxContainer.children().last().prev().append($selectorContainer);

    $quickQueryBoxContainer.children().last().before($container);

    return {
      $element: $selectorContainer,
      type: 'follow-up',
    };
  }

  static closeAndRemovePopover($popover) {
    $popover.remove();
    $(document).off('click', this.closeAndRemovePopover);
  }

  static autoRefetch() {
    let autoUpdateIntervalId;

    window.addEventListener('focus', function () {
      autoUpdateIntervalId = Utils.setImmediateInterval(async () => {
        if (!$('#dropdown-wrapper').length) return;

        await ModelSelector.getDefaultModels();

        ModelSelector.updateImageModelFn();
        ModelSelector.updateChatModelFn();
      }, 5000);
    });

    window.addEventListener('blur', function () {
      clearInterval(autoUpdateIntervalId);
    });
  }

  static createSelectors() {
    const targetContainer =
      this.findFollowUpQueryBoxContainer() || this.findButtonBarContainer();

    if (!targetContainer) return;

    const $targetContainer = targetContainer.$element;

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

    $targetContainer.prepend(imageModelSelector.$element);

    $targetContainer.prepend(chatModelSelector.$element);

    if (
      (Utils.whereAmI() !== 'thread' && Utils.whereAmI() !== 'collection') ||
      $targetContainer.closest('div[data-testid="quick-search-modal"]').length
    )
      $targetContainer.prepend(collectionSelector.$element);

    $targetContainer.prepend(focusSelector.$element);

    $targetContainer.addClass('flex-wrap col-span-2');

    // if user scrolls -> close all popovers
    $(window).scroll(() => {
      $('[id$="-popover"]').each((_, popover) => {
        $(popover).remove();
      });
    });

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
