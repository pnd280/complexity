class ThreadAnchor {
  static createWrapper() {
    let $anchorWrapper = $('#thread-anchor-wrapper');

    if (!$anchorWrapper.length) {
      $anchorWrapper = window.$UI_HTML.find('#thread-anchor-wrapper').clone();

      $('main').append($anchorWrapper);

      const $stickyHeader = $('.sticky.left-0.right-0.top-0.z-20.border-b');

      const top = $stickyHeader.height() + 50;

      $anchorWrapper.css('right', `60px`);
      $anchorWrapper.css('top', `${top + 10}px`);

      $('#visibility-toggle').on('click', () => {
        $anchorWrapper.find('#container').toggleClass('invisible');
      });
    }

    return {
      $element: $anchorWrapper,
      addAnchor: ({ input, isSelected, params }) => {
        const $anchor = window.$UI_HTML.find('#thread-anchor').clone();

        $anchor.text(input.name);

        isSelected && $anchor.addClass('selected');

        $anchor[0].params = params;

        $anchor.on('click', input.onClick);

        $anchor.on('contextmenu', input.oncontextmenu);

        $anchorWrapper.find('#container').append($anchor);
      },
    };
  }

  static updateThreadMessageAnchorPosition() {
    const index = Utils.findMostVisibleElementIndex(
      $(
        '.h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child > div:first-child > div:first-child > div'
      )
        .children()
        .toArray()
    );

    unsafeWindow.STORE.inViewMessageIndex = index;
  }

  static mountObserver() {
    const callback = (initialRender = false) => {
      $('#thread-anchor-wrapper #container').empty();

      if (Utils.whereAmI() !== 'thread')
        return $('#thread-anchor-wrapper').remove();

      this.updateThreadMessageAnchorPosition();

      const wrapper = this.createWrapper();

      if (!wrapper) return;

      const { addAnchor } = this.createWrapper();

      const $messageContainer = $(
        '.h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child > div:first-child > div:first-child > div'
      );

      if (!$messageContainer.length) return;

      $messageContainer.each((index, messageBlock) => {
        const $query = $(messageBlock).find('.my-md.md\\:my-lg');
        const $answer = $(messageBlock).find(
          '.mb-sm.flex.w-full.items-center.justify-between'
        );

        const name = $query.find('>*').text();

        addAnchor({
          input: {
            name,
            onClick: () => {
              Utils.scrollToElement($query, -50);
            },
            oncontextmenu: (event) => {
              event.preventDefault();

              Utils.scrollToElement($answer, -10);
            },
          },
          isSelected: index == unsafeWindow.STORE.inViewMessageIndex,
        });
      });

      if (initialRender) {
        if ($messageContainer.children().length < 2) {
          $('#thread-anchor-wrapper #container').addClass('invisible');
        } else {
          $('#thread-anchor-wrapper #container').removeClass('invisible');
        }
      }
    };

    callback();

    window.addEventListener('scroll', () => callback());

    Utils.onShallowRouteChange(() => {
      requestIdleCallback(() => {
        callback(true);
      });
    });
  }
}
