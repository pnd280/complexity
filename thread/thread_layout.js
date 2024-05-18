class ThreadLayout {
  static alterThreadCollectionButton($collectionButtonAnchor) {
    const $collectionButton = $collectionButtonAnchor.parents().eq(1);

    if (!isThreadPage() || !isThreadInCollection()) return;

    $collectionButton.attr('id', 'thread-collection-button');

    $collectionButton.off('click').on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const { $popover, addSelection } = DropdownUI.createSelectionPopover({
        sourceElement: $collectionButton,
        sourceElementId: 'thread-collection-button',
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
          UI.closeAndRemovePopover($popover);
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

  static relocateQueryBox($querybox) {
    if (Utils.whereAmI() !== 'thread') return;

    const $wrapper = $querybox.parent();

    $wrapper.addClass('animate-all duration-300');
    $wrapper.parent().addClass('animate-all duration-300');
    $wrapper.removeClass('md:col-span-8').addClass('col-span-12');
    $wrapper.parent().addClass('dock-bottom');

    return true;
  }

  static alterMessageQuery({ $query }) {
    if (Utils.whereAmI() !== 'thread') return;

    const { $messageBlock } = $query[0].params;

    const mardownedText = Utils.markdown2Html($query.text());

    const $newQueryWrapper = $('<div>')
      .html(mardownedText)
      .attr('id', 'markdowned-text-wrapper')
      .addClass(
        'prose dark:prose-invert inline leading-normal break-words min-w-0 [word-break:break-word] default font-display dark:text-textMainDark selection:bg-super/50 selection:text-textMain dark:selection:bg-superDuper/10 dark:selection:text-superDark'
      );

    const fontFamily =
      $('h1')?.css('font-family')?.split(',')?.[0]?.trim() || 'Segoe UI';

    const currentFontSize = parseInt($newQueryWrapper.css('font-size'));

    const calculatedWrappedLines = Utils.calculateRenderLines(
      $query.text(),
      $query.width(),
      fontFamily,
      currentFontSize
    );

    $newQueryWrapper.addClass(
      calculatedWrappedLines <= 3 ? 'text-3xl' : 'text-base'
    );

    $query.append($newQueryWrapper);

    $query.off('dblclick').on('dblclick', () => {
      if ($query.find('textarea').length) return;
      const $buttonBar = $messageBlock.find(
        '.mt-sm.flex.items-center.justify-between'
      );

      const $editButton = $buttonBar.children().last().children().eq(1);

      $editButton.click();
    });
  }

  static addQueryAnchor({ $answerHeading }) {
    $(':root').addClass('thread-layout-alternate');

    const { $messageBlock } = $answerHeading[0].params;

    if ($messageBlock?.find('#query-anchor').length) return;

    const { $query } = $answerHeading[0].params;

    const $cloned = $answerHeading.clone();

    $cloned.addClass('mt-8');

    $cloned.attr('id', 'query-anchor');

    const $stickyHeader = UI.getStickyHeader();

    const $userAvatar = $stickyHeader
      .find('img[alt="User avatar"]')
      .first()
      .clone();

    const name = $stickyHeader
      .find('.break-all.line-clamp-1.default.font-sans')
      .last()
      .text();

    const ownUsername = unsafeWindow.STORE.username;

    const displayName = name
      ? name === ownUsername
        ? 'You'
        : name
      : 'Anonymous';

    $cloned.find('div[color="super"]').children().last().text(displayName);

    $cloned.addClass('fade-in animate-in duration-300');

    if (!$userAvatar.length) {
      $cloned.find('svg').replaceWith($UI_TEMPLATE.find('#user-icon').clone());

      $query.before($cloned);

      $cloned
        .find('#user-icon')
        .css('width', '24px')
        .css('height', '24px')
        .parent()
        .css('width', '24px');
    } else {
      $cloned
        .find('svg')
        .replaceWith(
          $UI_TEMPLATE.find('#avatar-box').clone().html($userAvatar)
        );

      $query.before($cloned);

      $cloned
        .find('#avatar-box')
        .addClass('overflow-hidden')
        .parent()
        .removeClass('overflow-hidden')
        .css('width', '24px');
    }
  }

  static toggleEmptyThreadMessageVisualContainer() {
    const $messageContainer = UI.getMessageContainer();

    $messageContainer.children().each((_, messageBlock) => {
      if ($(messageBlock).find('.visual-col > div > div:nth-child(2)').length) {
        $(messageBlock).find('.visual-col').show();
        $(messageBlock)
          .find('.message-col')
          .removeClass('col-span-12')
          .addClass('col-span-8');
      } else {
        $(messageBlock).find('.visual-col').hide();
        $(messageBlock)
          .find('.message-col')
          .removeClass('col-span-8')
          .addClass('col-span-12');
      }
    });
  }

  static mountObserver() {
    MyObserver.onElementExist({
      selector:
        'a[href*="/collections"] .overflow-hidden.truncate.text-ellipsis',
      callback: ({ element }) => this.alterThreadCollectionButton($(element)),
    });

    MyObserver.onElementExist({
      selector: () => [
        $('.pointer-events-auto.md\\:col-span-8').children().last()[0],
      ],
      callback: async ({ element }) => {
        while (!$(element).width()) {
          await Utils.sleep(100);
        }

        this.relocateQueryBox($(element));
      },
    });

    MyObserver.onElementExist({
      selector: () => {
        const messageBlocks = UI.getMessageBlocks();
        return messageBlocks.map(({ $query, $messageBlock }) => {
          if (!$messageBlock?.length) return null;

          const element = $query[0];
          element.params = { $messageBlock };
          return element;
        });
      },
      callback: ({ element }) => {
        this.alterMessageQuery({ $query: $(element) });
      },
    });

    MyObserver.onElementExist({
      selector: () => {
        const messageBlocks = UI.getMessageBlocks();
        return messageBlocks
          .filter(({ $answerHeading }) => $answerHeading.length)
          .map(({ $query, $answerHeading, $messageBlock }) => {
            if (!$messageBlock?.length) return null;

            const element = $answerHeading[0];
            element.params = { $query, $messageBlock };
            return element;
          });
      },
      callback: ({ element }) => {
        this.addQueryAnchor({ $answerHeading: $(element) });
      },
    });

    MyObserver.onElementExist({
      selector: () => [UI.getMessageContainer()[0]],
      callback: ({ element }) => {
        MyObserver.onDOMChanges({
          targetNode: element,
          callback: () => {
            this.toggleEmptyThreadMessageVisualContainer();
          },
        });
      },
    });

    MyObserver.onElementExist({
      selector: '[data-state="open"][data-align="center"]',
      callback: ({ element }) => {
        $(element).remove();
      },
    });
  }
}
