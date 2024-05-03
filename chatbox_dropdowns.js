class ChatBoxDropdowns {
  static async fetchSettings() {
    const url = 'https://www.perplexity.ai/p/api/v1/user/settings';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  }

  static async experimental_fetchCollections() {
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

  static async fetchCollections() {
    const url = 'https://www.perplexity.ai/library';
    const html = await fetch(url);

    if (!html.ok) throw new Error('Failed to fetch collections');

    const content = await html.text();

    const data = content.match(
      /<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/s
    );

    const fetchedCollections = JSON.parse(data[1]).props.pageProps
      .dehydratedState.queries[1].state.data.pages[0];

    if (!fetchedCollections?.length) return [];

    const collections = [];

    fetchedCollections.forEach((collection) => {
      collections.push({
        title: collection.title,
        uuid: collection.uuid,
      });
    });

    return collections;
  }

  static createDropdowns() {
    const $buttonBar = initializeButtonBar();

    if (!$buttonBar) return;

    const initializeCollections = () => {
      let collections = [{ title: 'Default', uuid: undefined }];
      this.experimental_fetchCollections().then((data) =>
        collections.push(...data)
      );
      return collections;
    };

    const updateFromSettings = (aiModels, imageModels) => {
      this.fetchSettings().then((settings) => {
        const aiModelCode = settings?.['default_model'];
        const aiModelName = aiModels.find((m) => m.code === aiModelCode)?.name;
        if (aiModelName) aiModelSelector.setText(aiModelName);

        const imageModelCode = settings?.['default_image_generation_model'];
        const imageModelName = imageModels.find(
          (m) => m.code === imageModelCode
        )?.name;
        if (imageModelName) imageModelSelector.setText(imageModelName);

        collectionSelector.setText(getDefaultCollectionTitle());
      });
    };

    const aiModels = getAiModels();
    const imageModels = getImageModels();
    let fetchedCollections = initializeCollections();

    const aiModelSelector = UI.createDropdown({
      selectorClass: 'model-selector',
      svgIcon: 'cpu',
    });
    const imageModelSelector = UI.createDropdown({
      selectorClass: 'model-selector',
      svgIcon: 'image',
    });

    const collectionSelector = UI.createDropdown({
      selectorClass: 'collection-selector',
      svgIcon: 'grid-round-2',
    });

    // const aiModelSelector = UI.createDropdown('', 'model-selector', 'cpu');
    // const imageModelSelector = UI.createDropdown('', 'model-selector', 'image');
    // const collectionSelector = UI.createDropdown(
    //   getDefaultCollectionTitle(),
    //   'collection-selector',
    //   'grid-round-2'
    // );

    updateFromSettings(aiModels, imageModels);

    setupModelSelector(aiModelSelector, aiModels, false);
    setupModelSelector(imageModelSelector, imageModels, true);
    setupCollectionSelector(collectionSelector, fetchedCollections);

    arrangeUI(
      $buttonBar,
      aiModelSelector,
      collectionSelector,
      imageModelSelector
    );

    function initializeButtonBar() {
      const $attachButton = $('div:contains("Attach")');

      let $buttonBar = $attachButton.closest(
        '.flex.bg-background.dark\\:bg-offsetDark.rounded-l-lg.col-start-1.row-start-2.-ml-2'
      );
      if (!$buttonBar.length || $buttonBar.children().length > 2) return null;

      $buttonBar
        .children('div:contains("Attach")')
        .find('> button > div')
        .removeClass('gap-xs');

      $buttonBar
        .children('div:contains("Attach")')
        .find('> button > div > div')
        .addClass('hidden');

      return $buttonBar.length > 1 ? $buttonBar.last() : $buttonBar;
    }

    function getAiModels() {
      return [
        { name: 'GPT-4', code: 'gpt4' },
        { name: 'Claude Opus', code: 'claude3opus' },
        { name: 'Claude Sonnet', code: 'claude2' },
        { name: 'Default', code: 'turbo' },
        { name: 'Sonar Large 32K', code: 'experimental' },
        { name: 'Mistral Large', code: 'mistral' },
      ];
    }

    function getImageModels() {
      return [
        { name: 'Playground', code: 'default' },
        { name: 'DALL-E 3', code: 'dall-e-3' },
        { name: 'SDXL', code: 'sdxl' },
      ];
    }

    function getDefaultCollectionTitle() {
      return (
        unsafeWindow.WSHOOK_INSTANCE.persistentSettings.collectionTitle ||
        'Default'
      );
    }

    function setupModelSelector(selector, models, isImageModel) {
      selector.$element.click(async () => {
        const { $popover, addSelection } = UI.createSelectionPopover(
          selector.$element[0]
        );
        if (!$popover) return;

        $('main').append($popover);
        const closePopover = () => closeAndRemovePopover($popover);

        models.forEach((model) => {
          addSelection({
            name: model.name,
            onClick: async () => {
              selector.setText(model.name);
              selector.$element.addClass('selector-loading');

              await setModel(model.code, isImageModel);

              unsafeWindow.WSHOOK_INSTANCE.persistentSettings.modelPreference =
                model.code;

              if (isImageModel) {
                unsafeWindow.WSHOOK_INSTANCE.persistentSettings.imageModel =
                  model.code;
              }

              updateFromSettings(getAiModels(), getImageModels());
              closePopover();

              selector.$element.removeClass('selector-loading');
            },
          });
        });

        setTimeout(() => $(document).on('click', closePopover), 100);
      });
    }

    function setupCollectionSelector(selector, collections) {
      selector.$element.click(async () => {
        const { $popover, addSelection } = UI.createSelectionPopover(
          selector.$element[0]
        );
        if (!$popover) return;

        $('main').append($popover);
        const closePopover = () => closeAndRemovePopover($popover);

        collections.forEach((collection) => {
          addSelection({
            name: collection.title,
            onClick: () => {
              unsafeWindow.WSHOOK_INSTANCE.persistentSettings.collection =
                collection.uuid;
              unsafeWindow.WSHOOK_INSTANCE.persistentSettings.collectionTitle =
                collection.title;
              Logger.log(
                'Selected collection:',
                collection.title,
                collection.uuid
              );
              $('.collection-selector-text').text(collection.title);
              closePopover();
            },
          });
        });

        setTimeout(() => $(document).on('click', closePopover), 100);
      });
    }

    function closeAndRemovePopover($popover) {
      $popover.remove();
      $(document).off('click', closeAndRemovePopover);
    }

    function arrangeUI(
      $buttonBar,
      aiModelSelector,
      collectionSelector,
      imageModelSelector
    ) {
      $buttonBar.children().first().after(imageModelSelector.$element);
      $buttonBar.children().first().after(aiModelSelector.$element);
      $buttonBar.children().first().after(collectionSelector.$element);
      $buttonBar.addClass('flex-wrap col-span-2');
    }

    async function setModel(model, isImageModel) {
      const settingsKey = isImageModel
        ? 'default_image_generation_model'
        : 'default_model';
      await unsafeWindow.WSHOOK_INSTANCE.sendMessage({
        messageCode: 423,
        event: 'save_user_settings',
        data: {
          [settingsKey]: model,
        },
      });
    }
  }
}
