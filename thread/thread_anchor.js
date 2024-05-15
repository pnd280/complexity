class ThreadAnchor {
  static createWrapper() {
    let $anchorWrapper = $('#thread-anchor-wrapper');

    const $stickyHeader = UI.getStickyHeader();

    const top = $stickyHeader.height() + 50;

    if (!$anchorWrapper.length) {
      $anchorWrapper = $UI_TEMPLATE.find('#thread-anchor-wrapper').clone();

      $('main').append($anchorWrapper);

      const $container = $anchorWrapper.find('#container');

      const $hamburger = $UI_TEMPLATE.find('button.menu-button').clone();

      $('#visibility-toggle').html($hamburger);

      $('#visibility-toggle')
        .off('click')
        .on('click', () => {
          $container.hasClass('invisible') ? open() : close();
        });
    }

    return {
      $element: $anchorWrapper,
      addAnchor: ({ input, isSelected, params }) => {
        const $anchor = $UI_TEMPLATE.find('#thread-anchor').clone();

        $anchor.text(input.name);

        isSelected && $anchor.addClass('selected');

        $anchor[0].params = params;

        $anchor.on('click', input.onClick);

        $anchor.on('contextmenu', input.oncontextmenu);

        $anchorWrapper.find('#container').append($anchor);
      },
      open,
      close,
      float: () => {
        $anchorWrapper.addClass('float');

        $anchorWrapper.css('right', `2rem`);
        $anchorWrapper.css('top', `${top / 16 + 1.25}rem`);
      },
      dock: () => {
        $anchorWrapper.removeClass('float');

        $anchorWrapper.css('right', `2rem`);
        $anchorWrapper.css('top', `${top - 30}px`);

        open();
      },
    };

    function open() {
      const $container = $('#thread-anchor-wrapper #container');
      const $hamburger = $('#visibility-toggle button.menu-button');

      $hamburger.addClass('active');

      $container.removeClass('hidden');

      void $container[0].offsetHeight;

      $container.removeClass('invisible');

      const $anchorWrapper = $('#thread-anchor-wrapper');

      setTimeout(() => {
        MyObserver.onElementBlur({
          $element: $container,
          eventName: 'anchorBlur',
          callback: () => {
            if (!$anchorWrapper.hasClass('float')) return;
            close($container, $hamburger);
          },
        });
      }, 100);
    }

    function close() {
      const $anchorWrapper = $('#thread-anchor-wrapper');
      
      if (!$anchorWrapper.hasClass('float')) return;

      const $container = $anchorWrapper.find('#container');

      $('button.menu-button').removeClass('active');

      $container.addClass('invisible');

      $anchorWrapper.off('transitionend').on('transitionend', () => {
        if ($container.hasClass('invisible')) {
          $container.addClass('hidden');
        }
      });
    }
  }

  static updateThreadMessageAnchorPosition() {
    const index = Utils.findMostVisibleElementIndex(
      UI.getMessageContainer().children().toArray()
    );

    unsafeWindow.STORE.inViewMessageIndex = index;
  }

  static mountObserver() {
    const callback = (initialRender) => {
      $('#thread-anchor-wrapper #container').empty();

      if (Utils.whereAmI() !== 'thread') {
        return $('#thread-anchor-wrapper').remove();
      }

      this.updateThreadMessageAnchorPosition();

      const $messageContainer = UI.getMessageContainer();

      if (!$messageContainer.length) return;

      const wrapper = this.createWrapper(
        initialRender && $messageContainer.children().length >= 2
      );

      if (!wrapper) return;

      const { addAnchor, open, close, float, dock } = wrapper;

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

      float();

      const anchorWrapperWidth = 250;

      const isEnoughSpace =
        $messageContainer.offset().left +
          $messageContainer.width() +
          anchorWrapperWidth <
        window.innerWidth - 50;

      if (isEnoughSpace) {
        dock();
      } else {
        float();
      }

      initialRender && $messageContainer.children().length >= 2 && open();
      initialRender && $messageContainer.children().length < 2 && close();
    };

    callback(true);

    window.addEventListener('scroll', () => callback(false));

    MyObserver.onShallowRouteChange(() => {
      requestIdleCallback(() => {
        callback(true);
      });
    });

    $(window)
      .off('resize.threadAnchor')
      .on('resize.threadAnchor', () => {
        callback(false);
      });
  }
}
