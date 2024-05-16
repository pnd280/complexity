class CollectionSelector {
  static async fetchCollections() {
    const url = `https://www.perplexity.ai/_next/data/${window.BUILD_ID}/en-US/library.json`;
    let jsonData = await fetch(url);

    if (!jsonData.ok) throw new Error('Failed to fetch collections');

    jsonData = JSONUtils.safeParse(await jsonData.text());

    const fetchedCollections =
      jsonData.pageProps.dehydratedState.queries[1].state.data.pages[0];

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

    unsafeWindow.STORE.username = jsonData.pageProps.session.user.username;

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
    const activeCollection = unsafeWindow.STORE.collections?.find(
      (e) => e.uuid == unsafeWindow.STORE.activeCollectionUUID
    );

    return (
      activeCollection?.dropdownTitle || activeCollection?.title || 'Collection'
    );
  }

  static createDropdown() {
    return DropdownUI.create({
      selectorClass: 'collection-selector',
      svgIcon: 'grid-round-2',
    });
  }

  static setupSelectionContextMenu(
    { title, instructions, uuid, url, $anchor, isContextMenu = true },
    selector
  ) {
    const { $popover, addSelection } = DropdownUI.createSelectionPopover({
      sourceElemnt: null,
      sourceElementId: 'collection-selector-context-menu',
      isContextMenu,
    });

    if (!$popover) return;

    $('main').append($popover);

    const closePopover = () => UI.closeAndRemovePopover($popover);

    addSelection({
      input: {
        name: 'Edit prompt',
        onClick: () => {
          closePopover();
          PromptBoxUI.show({
            title: `Edit ${title}'s Prompt`,
            fields: [
              {
                title: 'AI Prompt',
                fieldName: 'ai_prompt',
                description: 'Instructions for the AI to follow',
                value: instructions,
                type: 'textarea',
                limit: 2000,
              },
            ],
            footerButtons: [
              {
                text: 'Save',
                onClick: async (content) => {
                  await this.editCollectionPrompt({
                    collection_uuid: uuid,
                    instructions: content['ai_prompt'],
                  });

                  Toast.show({
                    message: '✅ Collection prompt updated',
                  });
                },
                type: 'primary',
              },
            ],
          });
        },
      },
    });

    addSelection({
      input: {
        name: 'View all threads',
        onClick: () => {
          window.location.href = `https://www.perplexity.ai/collections/${url}`;
          closePopover();
        },
      },
    });

    const isDefaultCollection =
      JSONUtils.safeParse(localStorage.getItem('defaultCollectionUUID')) ===
      uuid;

    addSelection({
      input: {
        name: isDefaultCollection ? 'Clear default' : 'Set as default',
        onClick: () => {
          if (!isDefaultCollection) {
            if (!uuid) {
              localStorage.removeItem('defaultCollectionUUID');
            } else {
              localStorage.setItem(
                'defaultCollectionUUID',
                JSON.stringify(uuid)
              );
            }
          } else {
            localStorage.removeItem('defaultCollectionUUID');
          }

          unsafeWindow.STORE.activeCollectionUUID = uuid;

          selector?.setText({
            text: this.getDefaultTitle(),
          });

          closePopover();
        },
      },
    });

    UI.showPopover({
      $anchor,
      $popover: $popover,
      placement: isContextMenu ? 'horizontal' : 'vertical',
    });

    setTimeout(() => $(document).on('click', closePopover), 100);
  }

  static async editCollectionPrompt(collection) {
    const { collection_uuid, instructions, title } = collection;

    await unsafeWindow.WSHOOK_INSTANCE.sendMessage({
      messageCode:
        unsafeWindow.WSHOOK_INSTANCE.getActiveSocketType() === 'socket'
          ? 420
          : 421,
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

  static setupSelector(selector, collections) {
    selector.$element.off('click').on('click', () => {
      const { $popover, addSelection } = DropdownUI.createSelectionPopover({
        sourceElement: selector.$element[0],
        sourceElementId: 'collection-selector',
      });

      if (!$popover) return;

      $('main').append($popover);

      const closePopover = () => UI.closeAndRemovePopover($popover);

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

              selector.setText({ text: this.getDefaultTitle() });

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
        $selection.on('contextmenu', (e) => {
          e.preventDefault();

          if (!$selection[0].params.uuid) return;

          this.setupSelectionContextMenu(
            {
              $anchor: $selection,
              ...$selection[0].params,
            },
            selector
          );
        });
      });

      UI.showPopover({ $anchor: selector.$element, $popover });

      setTimeout(() => $(document).on('click', closePopover), 100);
    });

    selector.$element.off('contextmenu').on('contextmenu', (e) => {
      e.preventDefault();

      const activeCollection = collections.find(
        (collection) =>
          collection.uuid === unsafeWindow.STORE.activeCollectionUUID
      );

      if (!activeCollection || !activeCollection.uuid) return;

      this.setupSelectionContextMenu({
        $anchor: selector.$element,
        ...activeCollection,
        isContextMenu: false,
      });
    });
  }
}
