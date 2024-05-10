class UITweaks {
  static findReactFiber($element) {
    const fiberKey = Object.keys($element[0]).find((key) =>
      key.startsWith('__reactFiber')
    );

    const fiber = $element[0][fiberKey];

    return fiber;
  }

  static alterSloganHeading(text = 'Chatplexity') {
    if (
      $(
        '.mb-lg.flex.items-center.justify-center.pb-xs.md\\:text-center span'
      ).text() !== text
    )
      $(
        '.mb-lg.flex.items-center.justify-center.pb-xs.md\\:text-center span'
      ).text(text);
  }

  static alterThreadCollectionButton() {
    const $collectionButton = $(
      'a[href*="/collections"] .overflow-hidden.truncate.text-ellipsis'
    )
      .parents()
      .eq(1);

    if (!isThreadPage() || !isThreadInCollection()) return;

    $collectionButton.parent().attr('id', 'thread-collection-button');

    $collectionButton.off('click').on('click', (e) => {
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

    $('.pointer-events-auto.md\\:col-span-8')
      .removeClass('md:col-span-8')
      .addClass('col-span-12');

    const $messageContainer = this.getMessageContainer();

    $messageContainer.children().each((_, messageBlock) => {
      const $buttonBar = $(messageBlock).find(
        '.mt-sm.flex.items-center.justify-between'
      );

      const $editButton = $buttonBar.children().last().children().eq(1);

      const $query = $(messageBlock).find('.my-md.md\\:my-lg');

      if (!$(messageBlock).find('#query-anchor').length) {
        addQueryAnchor($(messageBlock), $query);
      }

      if (!$query.data('is-rewritten')) {
        const mardownedText = Utils.convertMarkdownToHTML($query.text());

        const $wrapper = $('<div>')
          .html(mardownedText)
          .attr('id', 'markdowned-text-wrapper')
          .addClass(
            'prose dark:prose-invert inline leading-normal break-words min-w-0 [word-break:break-word] default font-display dark:text-textMainDark selection:bg-super/50 selection:text-textMain dark:selection:bg-superDuper/10 dark:selection:text-superDark'
          );

        const fontFamily =
          $('h1')?.css('font-family')?.split(',')?.[0]?.trim() || 'Segoe UI';

        const calculatedWrappedLines = Utils.calculateLines(
          $query.text(),
          $query.width(),
          fontFamily,
          16
        );

        $wrapper.addClass(
          calculatedWrappedLines <= 3 ? 'text-3xl' : 'text-base'
        );

        $query.append($wrapper);

        $query.data('is-rewritten', true);
      }

      $query.off('dblclick').on('dblclick', () => {
        if ($query.find('textarea').length) return;
        $editButton.click();
      });
    });

    function addQueryAnchor($messageBlock, $query) {
      const $answerHeading = $messageBlock
        .find('.mb-sm.flex.w-full.items-center.justify-between')
        .last();

      if (!$answerHeading.length) return;

      const $cloned = $answerHeading.clone();

      $cloned.addClass('mt-8');

      $cloned.attr('id', 'query-anchor');

      const $stickyHeader = UITweaks.getStickyHeader();

      const $userAvatar = $stickyHeader
        .find('img[alt="User avatar"]')
        .first()
        .clone();

      const name = $stickyHeader
        .find('.break-all.line-clamp-1.default.font-sans')
        .text();

      const ownUsername = $('.break-all.line-clamp-1.default.font-sans')
        .first()
        .text();

      $cloned
        .find('div[color="super"]')
        .children()
        .last()
        .text(name === ownUsername ? 'You' : name);

      if (!$userAvatar.length) {
        $cloned.find('div[color="super"]').children().first().remove();

        $cloned.find('div[color="super"]').children().last().text('Anonymous');
      } else {
        $cloned.find('svg').replaceWith($userAvatar);
      }

      $query.before($cloned);

      $messageBlock
        .find('img[alt="User avatar"]')
        .parent()
        .addClass('w-[24px]');
    }
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

  static getMessageContainer() {
    let $messageContainer = $(
      '.h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child > div:first-child > div:first-child > div'
    );

    if (!$messageContainer.length) {
      $messageContainer = $(
        '.h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child > div:first-child > div:nth-child(2)'
      );
    }

    return $messageContainer;
  }

  static getStickyHeader() {
    return $('.sticky.left-0.right-0.top-0.z-20.border-b');
  }
}
