class UITweaks {
  static findReactFiber($element) {
    const fiberKey = Object.keys($element[0]).find((key) =>
      key.startsWith('__reactFiber')
    );

    const fiber = $element[0][fiberKey];

    return fiber;
  }

  static declutterCollectionPage() {
    if (
      !window.location.href.includes('https://www.perplexity.ai/collections') ||
      !$('.col-span-4').length
    )
      return;

    $('.col-span-8').children().first().find('> div:nth-child(2)').remove();
    $('.col-span-4').remove();
    $('.col-span-8').removeClass('col-span-8').addClass('col-span-12');
  }

  static populateCollectionButtons() {
    const $collectionButton = $('a[href*="/collections"]');

    if (!isThreadPage()) return;

    if (!isInCollection()) {
      $('#collection-button-container').children().not(':last').remove();
      return;
    }

    if ($('#collection-button-container').children().length > 1) return;

    $collectionButton.parent().attr('id', 'collection-button-container');

    window.$UI_HTML
      .find('#thread-swap-collection')
      .clone()
      .append(window.$UI_HTML.find('svg[data-icon="shuffle"]').clone())
      .appendTo('#collection-button-container')
      .on('click', triggerCollectionSwap);

    window.$UI_HTML
      .find('#thread-remove-from-collection')
      .clone()
      .append(window.$UI_HTML.find('svg[data-icon="xmark"]').clone())
      .appendTo('#collection-button-container')
      .on('click', triggerRemoveFromCollection);

    async function triggerRemoveFromCollection() {
      await triggerCollectionActionMenu();

      $('div[data-testid="thread-remove-from-collection"]').click();
    }

    async function triggerCollectionSwap() {
      await triggerCollectionActionMenu();

      $('div[data-testid="thread-swap-collection"]').click();
    }

    async function triggerCollectionActionMenu() {
      $('button[data-testid="thread-dropdown-menu"]').click();

      while (!$('div[data-testid="thread-swap-collection"]').length) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }

    function isThreadPage() {
      return window.location.href.includes('https://www.perplexity.ai/search/');
    }

    function isInCollection() {
      return $collectionButton.length;
    }
  }

  static hideThreadShareButtons() {
    if (!window.location.href.includes('https://www.perplexity.ai/search/'))
      return;

    if ($('button > div > div:contains("Share")').length > 1) {
      $('button > div > div:contains("Share")').each((index, el) => {
        if (index === 0) return;

        $(el).parent().parent().hide();
      });
    }
  }

  static alterRewriteButton() {
    if (!window.location.href.includes('https://www.perplexity.ai/search/'))
      return;

    const $rewriteButtonTexts = $('button > div > div:contains("Rewrite")');

    if ($rewriteButtonTexts.length) {
      $rewriteButtonTexts.each((_, el) => {
        const $button = $(el).parents().eq(1);

        if ($button.attr('id') === 'altered-rewrite-button') return;
        if ($button.parents().eq(1).children().length > 2) return;

        const $clonedButton = $button.clone();

        $button.parents().eq(1).children().first().after($clonedButton);

        $clonedButton.attr('id', 'altered-rewrite-button');

        $button.parent().css('width', '0').css('visibility', 'hidden');

        $clonedButton.on('contextmenu', (e) => {
          e.preventDefault();
          $button.click();
        });

        const $threadBlock = $button.parents().eq(5);

        const $editThreadButton = $button
          .parents()
          .eq(3)
          .children()
          .last()
          .children()
          .eq(1)
          .children()
          .eq(1);

        $clonedButton.on(
          'click',
          rewriteCurrentMessage.bind(null, $editThreadButton, $threadBlock)
        );
      });
    }

    async function rewriteCurrentMessage($editThreadButton, $threadBlock) {
      $editThreadButton.click();

      while (
        !$threadBlock.find('div.text-align-center.relative:contains("Save")')
          .length
      ) {
        await Utils.sleep(10);
      }

      $threadBlock
        .find('div.text-align-center.relative:contains("Save")')
        .parents()
        .eq(1)
        .click();
    }
  }
}
