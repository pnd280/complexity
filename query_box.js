class QueryBox {
  static findButtonBar() {
    const $attachButton = $('div:contains("Attach")');

    let $buttonBar = $attachButton
      .closest(
        '.flex.bg-background.dark\\:bg-offsetDark.rounded-l-lg.col-start-1.row-start-2.-ml-2'
      )
      .last();

    if (!$buttonBar.length || $buttonBar.children().length > 2) return null;

    $buttonBar.attr('id', 'query-box-button-bar');

    $buttonBar
      .children('div:contains("Attach")')
      .find('> button > div')
      .removeClass('gap-xs');

    $buttonBar
      .children('div:contains("Attach")')
      .find('> button > div > div')
      .addClass('hidden');

    return $buttonBar;
  }

  static closeAndRemovePopover($popover) {
    $popover.remove();
    $(document).off('click', this.closeAndRemovePopover);
  }

  static createSelectors() {
    const $buttonBar = this.findButtonBar();

    if (!$buttonBar) return;

    function populateDefaults() {
      chatModelSelector.setText(ModelSelector.getDefaultChatModelName());
      imageModelSelector.setText(ModelSelector.getDefaultImageModelName());
      collectionSelector.setText(CollectionSelector.getDefaultTitle());
    }

    const chatModelSelector = ModelSelector.createChatModelDropdown();
    const imageModelSelector = ModelSelector.createImageModelDropdown();
    const collectionSelector = CollectionSelector.createDropdown();

    populateDefaults();

    ModelSelector.getDefaultModels().then(() => {
      const chatModels = ModelSelector.getPredefinedChatModels();
      const imageModels = ModelSelector.getPredefinedImageModels();

      populateDefaults();

      ModelSelector.setupSelector(chatModelSelector, chatModels, false);
      ModelSelector.setupSelector(imageModelSelector, imageModels, true);
    });

    CollectionSelector.getDropdownItems().then((collections) => {
      CollectionSelector.setupSelector(collectionSelector, collections);
    });

    $buttonBar.children().first().after(imageModelSelector.$element);

    $buttonBar.children().first().after(chatModelSelector.$element);

    if (
      Utils.whereAmI() !== 'collection' ||
      $buttonBar.closest('div[data-testid="quick-search-modal"]').length
    )
      $buttonBar.children().first().after(collectionSelector.$element);

    $buttonBar.addClass('flex-wrap col-span-2');
  }
}
