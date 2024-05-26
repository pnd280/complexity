class QueryBox {
  static preProcessButtonBarContainer($buttonBar) {
    const $buttonBarChildren = $buttonBar.children(
      ':not(.mr-xs.flex.shrink-0.items-center)'
    );

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

    return $buttonBar;
  }

  static preProcessFollowUpQueryBoxContainer($followUpQueryBoxContainer) {
    if (
      $followUpQueryBoxContainer &&
      $followUpQueryBoxContainer.children().eq(1).attr('class') ===
        'mb-2 flex justify-center'
    ) {
      $('.mb-2.flex.justify-center').prependTo($followUpQueryBoxContainer);
    }

    const $container = $('<div>').attr('id', 'query-box-follow-up-container');

    $followUpQueryBoxContainer.children().last().before($container);

    const $selectorContainer = $('<div>').attr('id', 'selector-container');

    $followUpQueryBoxContainer
      .children()
      .last()
      .prev()
      .append($selectorContainer);

    $followUpQueryBoxContainer.children().last().before($container);

    return $selectorContainer;
  }

  static injectPrompt({ currentQuery, $selector, resetAfterInjection = true }) {
    const prompt = PromptCollection.getPromptById(
      unsafeWindow.STORE.activePromptId
    );

    Utils.setReactTextareaValue(
      $selector[0],
      prompt?.prompt.replace('{{{query}}}', currentQuery) ?? currentQuery
    );

    if (!unsafeWindow.STORE.persistPrompt) {
      unsafeWindow.STORE.activePromptId = null;

      $('.prompt-collection-text').text(
        PromptCollection.getDefaultPromptTitle()
      );

      $('main').toggleClass('prompt-applied', false);
    }

    if (resetAfterInjection) {
      setTimeout(() => {
        Utils.setReactTextareaValue($selector[0], ' ');
        Utils.setReactTextareaValue($selector[0], '');
      }, 100);
    }
  }

  static bindPromptActivator() {
    const $textarea = UI.findActiveQueryBoxTextarea();

    $textarea.off('keydown').on('keydown', (e) => {
      if (e.key === 'Enter' && !e.ctrlKey) {
        return e.stopPropagation();
      }

      if (e.key === 'Enter' && e.ctrlKey) {
        if ($textarea.val().trim() === '') return e.stopPropagation();

        this.injectPrompt({
          currentQuery: $textarea.val(),
          $selector: $textarea,
          resetAfterInjection: false,
        });

        $('html, body').animate(
          {
            scrollTop: $(document).height(),
          },
          500
        );
      }
    });

    const $submitButton = UI.findActiveSubmitQueryButton();

    $submitButton.off('click').on('click', () => {
      this.injectPrompt({
        currentQuery: $textarea.val(),
        $selector: $textarea,
      });
    });
  }

  static createSelectors({ $element: $targetElement, type }) {
    if (!$targetElement?.length) return;

    const $targetContainer =
      type === 'button-bar'
        ? this.preProcessButtonBarContainer($targetElement)
        : this.preProcessFollowUpQueryBoxContainer($targetElement);

    this.bindPromptActivator();

    if (!$targetContainer?.length) return;

    const focusSelector = FocusSelector.createDropdown();
    const chatModelSelector = ModelSelector.createChatModelDropdown();
    const imageModelSelector = ModelSelector.createImageModelDropdown();
    const collectionSelector = CollectionSelector.createDropdown();
    const promptCollectionSelector = PromptCollection.createDropdown();

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

    PromptCollection.setupSelector(promptCollectionSelector);

    $targetContainer.append(focusSelector.$element);

    if (
      (Utils.whereAmI() !== 'thread' && Utils.whereAmI() !== 'collection') ||
      $targetContainer.closest('div[data-testid="quick-search-modal"]').length
    )
      $targetContainer.append(collectionSelector.$element);

    $targetContainer.append(promptCollectionSelector.$element);

    $targetContainer.append(chatModelSelector.$element);

    $targetContainer.append(imageModelSelector.$element);

    $targetContainer.addClass('flex-wrap col-span-2');

    function populateDefaults() {
      focusSelector.setText({
        text: FocusSelector.getDefaultTitle().title,
        icon: FocusSelector.getDefaultTitle().icon,
      });

      promptCollectionSelector.setText({
        text: PromptCollection.getDefaultPromptTitle(),
      });

      ModelSelector.setChatModelName(chatModelSelector);

      ModelSelector.setImageModelName(imageModelSelector);

      collectionSelector.setText({
        text: CollectionSelector.getDefaultTitle(),
      });
    }
  }

  static mountObserver() {
    MyObserver.onElementExist({
      selector: () =>
        $('textarea[placeholder="Ask anything..."]').next().toArray(),
      callback: ({ element }) => {
        this.createSelectors({
          $element: $(element),
          type: 'button-bar',
        });
      },
    });

    MyObserver.onElementExist({
      selector: () => [
        $('textarea[placeholder="Ask follow-up"]').parents().eq(6)[0],
      ],
      callback: ({ element }) => {
        if (Utils.whereAmI() === 'page') return;

        this.createSelectors({
          $element: $(element),
          type: 'follow-up-querybox',
        });
      },
    });

    MyObserver.onElementExist({
      selector: '.pointer-events-auto .mb-2.flex.justify-center',
      callback: () => {
        if (Utils.whereAmI() === 'page') return;

        const $querybox = $('textarea[placeholder="Ask follow-up"]')
          .parents()
          .eq(6);

        $querybox.children().last().before($('#query-box-follow-up-container'));
      },
    });
  }
}
