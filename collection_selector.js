class CollectionSelector {
  static async fetchCollections() {
    const url = `https://www.perplexity.ai/_next/data/${window.BUILD_ID}/en-US/library.json`;
    let jsonData = await fetch(url);

    if (!jsonData.ok) throw new Error('Failed to fetch collections');

    jsonData = await jsonData.text();

    const fetchedCollections =
      JSON.parse(jsonData).pageProps.dehydratedState.queries[1].state.data
        .pages[0];

    if (!fetchedCollections?.length) return [];

    const collections = [];

    fetchedCollections.forEach((collection) => {
      collections.push({
        title: collection.title,
        uuid: collection.uuid,
        instructions: collection.instructions,
      });
    });

    return collections;
  }

  static async getDropdownItems() {
    const data = await CollectionSelector.fetchCollections();

    const collections = [{ title: 'Default', uuid: undefined }, ...data];

    return collections;
  }

  static getDefaultTitle() {
    return (
      unsafeWindow.WSHOOK_INSTANCE.persistentSettings.collection?.title ||
      'Default'
    );
  }

  static createDropdown() {
    return UI.createDropdown({
      selectorClass: 'collection-selector',
      svgIcon: 'grid-round-2',
    });
  }

  static setupSelector(selector, collections) {
    selector.$element.click(async () => {
      const { $popover, addSelection } = UI.createSelectionPopover(
        selector.$element[0],
        'collection-selector'
      );
      if (!$popover) return;

      $('main').append($popover);
      const closePopover = () => QueryBox.closeAndRemovePopover($popover);

      collections.forEach((collection) => {
        addSelection({
          input: {
            name: collection.title,
            onClick: () => {
              unsafeWindow.WSHOOK_INSTANCE.persistentSettings.collection = {};
              unsafeWindow.WSHOOK_INSTANCE.persistentSettings.collection.uuid =
                collection.uuid;
              unsafeWindow.WSHOOK_INSTANCE.persistentSettings.collection.title =
                collection.title;
              Logger.log(
                'Selected collection:',
                collection.title,
                collection.uuid
              );
              $('.collection-selector-text').text(collection.title);
              closePopover();
            },
          },
          isSelected:
            collection.uuid ===
            unsafeWindow.WSHOOK_INSTANCE.persistentSettings.collection?.uuid,
        });
      });

      setTimeout(() => $(document).on('click', closePopover), 100);
    });
  }
}
