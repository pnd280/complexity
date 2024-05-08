class UITweaks {
  static findReactFiber($element) {
    const fiberKey = Object.keys($element[0]).find((key) =>
      key.startsWith('__reactFiber')
    );

    const fiber = $element[0][fiberKey];

    return fiber;
  }

  static alterSloganHeading() {
    if (
      $(
        '.mb-lg.flex.items-center.justify-center.pb-xs.md\\:text-center span'
      ).text() !== 'Chatplexity'
    )
      $(
        '.mb-lg.flex.items-center.justify-center.pb-xs.md\\:text-center span'
      ).text('Chatplexity');
  }

  static alterThreadCollectionButton() {
    const $collectionButton = $(
      'a[href*="/collections"] .overflow-hidden.truncate.text-ellipsis'
    )
      .parents()
      .eq(1);

    if (!isThreadPage() || !isThreadInCollection()) return;

    $collectionButton.parent().attr('id', 'thread-collection-button');

    $collectionButton.on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const { $popover, addSelection } = UI.createSelectionPopover({
        sourceElement: $collectionButton,
        sourceElementId: 'thread-collection-button',
        isContextMenu: true,
      });

      if (!$popover) return;

      $('main').append($popover);

      addSelection({
        input: {
          name: 'Swap collection',
          onClick: triggerCollectionSwap,
        },
      });

      addSelection({
        input: {
          name: 'Remove from collection',
          onClick: triggerRemoveFromCollection,
        },
      });

      addSelection({
        input: {
          name: 'View all threads',
          onClick: () => {
            window.location.href = $collectionButton.attr('href');
          },
        },
      });

      UI.showPopover({
        $anchor: $collectionButton,
        $popover,
      });

      setTimeout(() => {
        $(document).on('click', () => {
          QueryBox.closeAndRemovePopover($popover);
        });
      }, 100);
    });

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
      return Utils.whereAmI() === 'thread';
    }

    function isThreadInCollection() {
      return $collectionButton.length;
    }
  }

  static hideThreadShareButtons() {
    if (!Utils.whereAmI() === 'thread') return;

    if ($('button > div > div:contains("Share")').length > 1) {
      $('button > div > div:contains("Share")').each((index, el) => {
        if (index === 0) return;

        $(el).parent().parent().hide();
      });
    }
  }

  static alterRewriteButton() {
    if (Utils.whereAmI() !== 'thread') return;

    const $rewriteButtonTexts = $('button > div > div:contains("Rewrite")');

    if ($rewriteButtonTexts.length) {
      $rewriteButtonTexts.each((_, el) => {
        const $button = $(el).parents().eq(1);

        if ($button.attr('id') === 'altered-rewrite-button') return;

        $button.parent().css('width', '0').css('visibility', 'hidden');

        if (
          $button.parents().eq(1).children().length >
          (isInPrivateCollection() ? 2 : 1)
        )
          return;

        const $clonedButton = $button.clone();

        $button.parents().eq(1).children().last().before($clonedButton);

        $clonedButton.attr('id', 'altered-rewrite-button');

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

    function isInPrivateCollection() {
      return $('button > div > div:contains("Share")').length > 1;
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

  static alterThreadLayout() {
    if (Utils.whereAmI() !== 'thread') return;

    const $threadWrapper = $(
      '.h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg'
    );

    if (!$threadWrapper.length) return;

    const $messageContainer = $threadWrapper.find(
      '> div:first-child > div:first-child > div:first-child > div:first-child > div'
    );

    if (!$messageContainer.data('observer-mounted')) {
      $messageContainer.children().each((index, el) => {
        Utils.observeElementInViewport($(el)[0], () => {
          unsafeWindow.STORE.inViewMessageIndex = index;
          console.log(unsafeWindow.STORE.inViewMessageIndex);
        });
      });

      /* const $menu = $('<div>').attr('id', 'message-quick-nav');

      $menu.addClass('flex gap-xs');

      if (index > 0) {
        const $scrollToPrev = window.$UI_HTML.find('#ghost-button').clone();
        $scrollToPrev.find('#text').text('Prev');
        $menu.append($scrollToPrev);

        $scrollToPrev.on('click', () => {
          Utils.scrollToElement($messageContainer.children().eq(index - 1));
        });
      }

      const $scrollToQuery = window.$UI_HTML.find('#ghost-button').clone();
      $scrollToQuery.find('#text').text('#Query');
      $menu.append($scrollToQuery);

      $scrollToQuery.on('click', () => {
        Utils.scrollToElement(
          $messageContainer
            .children()
            .eq(unsafeWindow.STORE.inViewMessageIndex)
            .find('.my-md.md\\:my-lg')
        );
      });

      const $scrollToAnswer = window.$UI_HTML.find('#ghost-button').clone();
      $scrollToAnswer.find('#text').text('#Answer');
      $menu.append($scrollToAnswer);

      $scrollToAnswer.on('click', () => {
        Utils.scrollToElement(
          $messageContainer
            .children()
            .eq(unsafeWindow.STORE.inViewMessageIndex)
            .find('.mb-sm.flex.w-full.items-center.justify-between')
        );
      });

      if (index < $messageContainer.children().length - 1) {
        const $scrollToNext = window.$UI_HTML.find('#ghost-button').clone();
        $scrollToNext.find('#text').text('Next');
        $menu.append($scrollToNext);

        $scrollToNext.on('click', () => {
          Utils.scrollToElement($messageContainer.children().eq(index + 1));
        });
      }

      $('#query-box-follow-up-container').append($menu); */

      $messageContainer.data('observer-mounted', true);
    }

    $('.pointer-events-auto.md\\:col-span-8')
      .removeClass('md:col-span-8')
      .addClass('col-span-12');
  }

  static toggleEmptyThreadMessageVisualContainer() {
    const $container = $(
      '.pb-\\[124px\\].pt-md.md\\:pt-0 > div > div:nth-child(1)'
    ).children();

    $container.each((_, element) => {
      if (
        $(element)
          .find('> div > div > div > div')
          .eq(1)
          .find('> div > div')
          .children().length > 0
      ) {
        $(element).find('> div > div > div > div').eq(1).show();
        $(element)
          .find('> div > div > div > div')
          .eq(0)
          .removeClass('col-span-12')
          .addClass('col-span-8');
      } else {
        $(element).find('> div > div > div > div').eq(1).hide();
        $(element)
          .find('> div > div > div > div')
          .eq(0)
          .removeClass('col-span-8')
          .addClass('col-span-12');
      }
    });
  }
}
