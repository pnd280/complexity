class CollectionSelector {
  static async fetchCollections() {
    const url = `https://www.perplexity.ai/_next/data/${window.BUILD_ID}/en-US/library.json`;
    let jsonData = await fetch(url);

    if (!jsonData.ok) throw new Error('Failed to fetch collections');

    jsonData = await jsonData.text();

    const fetchedCollections =
      JSONUtils.safeParse(jsonData).pageProps.dehydratedState.queries[1].state
        .data.pages[0];

    if (!fetchedCollections?.length) return [];

    const collections = [];

    fetchedCollections.forEach((collection) => {
      collections.push({
        title: collection.title,
        uuid: collection.uuid,
        instructions: collection.instructions,
        url: collection.slug,
      });
    });

    unsafeWindow.STORE.collections = collections;

    return collections;
  }

  static async getDropdownItems() {
    const data = await CollectionSelector.fetchCollections();

    const collections = [
      { title: 'Default', dropdownTitle: 'Collection', uuid: null },
      ...data,
    ];

    return collections;
  }

  static getDefaultTitle() {
    const defaultActiveCollection = unsafeWindow.STORE.collections?.find(
      (e) => e.uuid == unsafeWindow.STORE.activeCollectionUUID
    );

    return (
      defaultActiveCollection?.dropdownTitle ||
      defaultActiveCollection?.title ||
      'Collection'
    );
  }

  static createDropdown() {
    return UI.createDropdown({
      selectorClass: 'collection-selector',
      svgIcon: 'grid-round-2',
    });
  }

  static setupSelectionContextMenu($selection, selector) {
    $selection.on('contextmenu', (e) => {
      e.preventDefault();

      const { $popover, addSelection } = UI.createSelectionPopover({
        sourceElemnt: null,
        sourceElementId: 'collection-selector-context-menu',
        isContextMenu: true,
      });

      if (!$popover) return;

      $('main').append($popover);

      const closePopover = () => QueryBox.closeAndRemovePopover($popover);

      addSelection({
        input: {
          name: 'Edit prompt',
          onClick: () => {
            closePopover();
            this.setupPromptEditModal($selection);
          },
        },
      });

      addSelection({
        input: {
          name: 'View all threads',
          onClick: () => {
            window.location.href = `https://www.perplexity.ai/collections/${$selection[0].params.url}`;
            closePopover();
          },
        },
      });

      addSelection({
        input: {
          name: 'Make default',
          onClick: () => {
            if (!$selection[0].params.uuid) {
              localStorage.removeItem('defaultCollectionUUID');
            } else {
              localStorage.setItem(
                'defaultCollectionUUID',
                JSON.stringify($selection[0].params.uuid)
              );
            }

            unsafeWindow.STORE.activeCollectionUUID = $selection[0].params.uuid;

            selector.setText(this.getDefaultTitle());

            closePopover();
          },
        },
      });

      UI.showPopover({
        $anchor: $selection,
        $popover: $popover,
        placement: 'horizontal',
      });

      setTimeout(() => $(document).on('click', closePopover), 100);
    });
  }

  static async editCollectionPrompt(collection) {
    const { collection_uuid, instructions, title } = collection;

    await unsafeWindow.WSHOOK_INSTANCE.sendMessage({
      messageCode: 420,
      event: 'edit_collection',
      data: [
        {
          collection_uuid,
          source: 'default',
          instructions,
          description: '',
          emoji: '',
          title,
          access: 1,
        },
      ],
    });

    const itemIndex = unsafeWindow.STORE.collections.findIndex(
      (item) => item.uuid === collection_uuid
    );

    unsafeWindow.STORE.collections[itemIndex].instructions = instructions;
  }

  static setupPromptEditModal($selection) {
    const $promptBox = window.$UI_HTML.find('#prompt-box-wrapper').clone();

    $promptBox.find('h1').text(`Edit ${$selection[0].params.title}'s Prompt`);

    $promptBox.find('#backdrop').click(() => {
      $promptBox.remove();
    });

    $promptBox.find('button[data-testid="close-modal"]').click(() => {
      $promptBox.remove();
    });

    const $textarea = window.$UI_HTML.find('#prompt-box-textarea').clone();

    $textarea.find('#title').text('AI Prompt');
    $textarea.find('#optional').remove();
    $textarea.find('textarea').text($selection[0].params.instructions);

    $promptBox.find('#sections').append($textarea);

    countCharacters();
    $promptBox.find('textarea').on('input', function () {
      countCharacters();
    });

    const $saveButton = window.$UI_HTML
      .find('#prompt-box-primary-button')
      .clone();

    $saveButton.find('#text').text('Save');

    $saveButton.click(() => {
      const instructions = $textarea.find('textarea').val();

      this.editCollectionPrompt({
        collection_uuid: $selection[0].params.uuid,
        instructions,
      });

      $promptBox.remove();
    });

    $promptBox.find('#footer').append($saveButton);

    $promptBox.appendTo('main');

    function countCharacters() {
      const $counter = $promptBox.find('#character-count');
      const length = $textarea.find('textarea').val().length;

      if (length > 1024 - 10) {
        $counter.removeClass('text-green');
        $counter.addClass('text-superAlt');
        $counter.text(`${1024 - length}`);
      } else {
        $counter.text('');
      }
    }
  }

  static setupSelector(selector, collections) {
    selector.$element.click(async () => {
      const { $popover, addSelection } = UI.createSelectionPopover({
        sourceElement: selector.$element[0],
        sourceElementId: 'collection-selector',
      });

      if (!$popover) return;

      $('main').append($popover);

      const closePopover = () => QueryBox.closeAndRemovePopover($popover);

      const $selections = collections.map((collection) =>
        addSelection({
          input: {
            name: collection.title,
            onClick: () => {
              unsafeWindow.STORE.activeCollectionUUID = collection.uuid;

              Logger.log(
                'Selected collection:',
                collection.title,
                collection.uuid
              );

              selector.setText(this.getDefaultTitle());

              closePopover();
            },
          },
          isSelected:
            collection.uuid === unsafeWindow.STORE.activeCollectionUUID,
          params: {
            url: collection.url,
            uuid: collection.uuid,
            instructions: collection.instructions,
            title: collection.title,
          },
        })
      );

      $selections.forEach(($selection) => {
        this.setupSelectionContextMenu($selection, selector);
      });

      UI.showPopover({ $anchor: selector.$element, $popover });

      setTimeout(() => $(document).on('click', closePopover), 100);
    });
  }
}
