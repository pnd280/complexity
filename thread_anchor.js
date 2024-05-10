class ThreadAnchor {
  static createWrapper() {
    let $anchorWrapper = $('#thread-anchor-wrapper');

    if (!$anchorWrapper.length) {
      $anchorWrapper = window.$UI_HTML.find('#thread-anchor-wrapper').clone();

      $('main').append($anchorWrapper);

      const $stickyHeader = UITweaks.getStickyHeader();

      const top = $stickyHeader.height() + 50;

      $anchorWrapper.css('right', `30px`);
      $anchorWrapper.css('top', `${top + 20}px`);

      const $hamburger = window.$UI_HTML.find('button.menu-button').clone();

      $('#visibility-toggle').html($hamburger);

      $('#visibility-toggle')
        .off('click')
        .on('click', () => {
          if ($anchorWrapper.find('#container').hasClass('invisible')) {
            $hamburger.addClass('active');

            $anchorWrapper.find('#container').removeClass('hidden');

            void $anchorWrapper.find('#container')[0].offsetHeight;

            $anchorWrapper.find('#container').removeClass('invisible');
          } else {
            $hamburger.removeClass('active');

            $anchorWrapper.find('#container').addClass('invisible');

            $anchorWrapper.off('transitionend').on('transitionend', () => {
              if ($anchorWrapper.find('#container').hasClass('invisible')) {
                $anchorWrapper.find('#container').addClass('hidden');
              }
            });
          }
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
      UITweaks.getMessageContainer().children().toArray()
    );

    unsafeWindow.STORE.inViewMessageIndex = index;
  }

  static mountObserver() {
    const callback = (initialRender = false) => {
      $('#thread-anchor-wrapper #container').empty();

      if (Utils.whereAmI() !== 'thread') {
        return $('#thread-anchor-wrapper').remove();
      }

      this.updateThreadMessageAnchorPosition();

      const wrapper = this.createWrapper();

      if (!wrapper) return;

      const { addAnchor } = this.createWrapper();

      const $messageContainer = UITweaks.getMessageContainer();

      if (!$messageContainer.length) return;

      $messageContainer.children().each((index, messageBlock) => {
        const $query = $(messageBlock).find('.my-md.md\\:my-lg');
        const $answer = $(messageBlock).find(
          '.mb-sm.flex.w-full.items-center.justify-between:not(#query-anchor)'
        );

        const name =
          $query.find('textarea').text() ||
          $query.find('>*:not(#markdowned-text-wrapper)').first().text();

        addAnchor({
          input: {
            name,
            onClick: () => {
              Utils.scrollToElement($(messageBlock).find('#query-anchor'), -10);
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
          $('button.menu-button').removeClass('active');
        } else {
          $('#thread-anchor-wrapper #container').removeClass('invisible');
          $('button.menu-button').addClass('active');
        }
      }
    };

    callback(true);

    window.addEventListener('scroll', () => callback());

    Utils.onShallowRouteChange(() => {
      requestIdleCallback(() => {
        callback(true);
      });
    });
  }
}
