class UI {
  static showPopover({ $anchor, $popover, placement = 'vertical' }) {
    if (!$anchor) return;

    const { top, left, height } = $anchor[0].getBoundingClientRect();

    const scrollY = window.scrollY || document.documentElement.scrollTop;

    const $popper = $popover.find('[data-tag="popper"]');

    let popperLeft;
    let popperTop;

    const bottomOverflowed =
      top + height + $popper.height() > window.innerHeight;

    const rightOverflowed = left + $popper.width() > window.innerWidth;

    if (placement === 'vertical') {
      popperTop =
        scrollY + (bottomOverflowed ? top - $popper.height() : top + height);
      popperLeft = rightOverflowed ? left - $popper.width() : left;
    } else {
      popperTop = top + scrollY;
      popperLeft = rightOverflowed
        ? left - $anchor.width() - 5
        : left + $anchor.width() + 5;
    }
    
    if (popperTop + $popper.height() > window.innerHeight) {
      popperTop = window.innerHeight - $popper.height() - 20;
    }

    $popper.css('top', `${popperTop}px`);
    $popper.css('left', `${popperLeft}px`);
  }
}

class DropdownUI {
  static create({ selectorClass, svgIcon = 'bars-filter' }) {
    const $dropdown = $UI_HTML.find('#dropdown-wrapper').clone();

    $dropdown.find('button').addClass(`${selectorClass}`);

    $dropdown.find('#text').addClass(`${selectorClass}-text`);
    $dropdown
      .find('button')
      .prepend(
        $UI_HTML.find(`svg[data-icon="${svgIcon}"]`).clone().addClass('mr-1')
      );

    return {
      $element: $dropdown,
      setText: (text, icon = undefined, emoji = undefined) => {
        $dropdown.find('#text').text(text);

        if (icon) {
          $dropdown.find('button > div#emoji').remove();
          $dropdown.find('button > svg').remove();
          $dropdown
            .find('button')
            .prepend(
              $UI_HTML.find(`svg[data-icon="${icon}"]`).clone().addClass('mr-1')
            );
        }

        if (emoji) {
          $dropdown.find('button > div#emoji').remove();
          $dropdown.find('button > svg').remove();
          $dropdown
            .find('button')
            .prepend(`<div id="emoji" class="mr-1">${emoji}</div>`);
        }
      },
      getText: () => $dropdown.find('#text').text(),
    };
  }

  static createSelectionPopover(
    { sourceElement, sourceElementId, isContextMenu } = {
      isContextMenu: false,
    }
  ) {
    const ownPopoverId = `#${sourceElementId}-popover`;

    if ($(ownPopoverId).length) {
      $(ownPopoverId).each((_, element) => {
        $(element).remove();
      });

      if (!isContextMenu)
        return {
          $popover: null,
          addSelection: () => {},
        };
    }

    if ($(`.popover:not(${ownPopoverId})`).length && !isContextMenu) {
      $(`.popover:not(${ownPopoverId})`).each((_, element) => {
        element.remove();
      });
    }

    const createSelectionElement = (input) => {
      const { name, onClick, onMouseEnter, onMouseLeave } = input;
      const $element = window.$UI_HTML.find('#selection').clone();

      $element.find('span#name').text(name);

      $element.click(onClick);
      $element.on('mouseenter', onMouseEnter?.bind(null, $element));
      $element.on('mouseleave', onMouseLeave);

      return $element;
    };

    const $popoverHTML = $UI_HTML.find('#popover').clone();

    const $popover = $($popoverHTML);
    const $menuContainer = $popover.find('[data-tag="menu"]');

    $popover.attr('id', `${sourceElementId}-popover`);

    return {
      $popover,
      addSelection: ({ input, isSelected, params }) => {
        const $selection = createSelectionElement(input);
        isSelected && $selection.addClass('selected', isSelected);
        $menuContainer.append($selection);

        $selection[0].params = params;

        return $selection;
      },
    };
  }
}

class PromptCollectionUI {
  static createPreviewPopover({ content, footerButtons }) {
    const $popover = $UI_HTML.find('#prompt-box-popover').clone();

    $popover.find('#content').text(content);

    !footerButtons?.length && $popover.find('#footer').remove();

    footerButtons &&
      footerButtons.forEach((button) => {
        const { text, svgIcon, onClick } = button;

        const $button = window.$UI_HTML
          .find('#prompt-box-popover-button')
          .clone();

        !svgIcon && $button.find('#icon').remove();

        svgIcon &&
          $button
            .find('#icon')
            .html(window.$UI_HTML.find(`svg[data-icon="${svgIcon}"]`).clone());

        $button.find('#text').text(text);

        $button.click(() => {
          const content = $popover.find('#content').html();

          onClick(content);

          QueryBox.closeAndRemovePopover($popover);
        });

        $popover.find('#footer').append($button);
      });

    return $popover;
  }
}

class Toast {
  static show({ message, prefix, duration = 2000 }) {
    const $toast = window.$UI_HTML.find('#toast-wrapper').clone();

    $toast.on('click', () => {
      $toast.remove();
    });

    prefix ? $toast.find('#icon').html(prefix) : $toast.find('#icon').remove();

    $toast.find('#message').text(message);

    $('main').append($toast);

    const $toasts = $('main').find('#toast-wrapper:not(.invisible)');

    $toasts.each((_, toast) => {
      // FIXME: curentTop should be retrieved after the transition ends

      const currentTop = parseInt($(toast).css('top').replace('px', ''));

      const newToastHeight = $toast.height();

      $(toast).css('top', `${currentTop + newToastHeight + 10}px`);
    });

    // FIXME: new toast top should be set after the all toasts are stacked properly
    $toast.css('top', '69px');
    $toast.removeClass('invisible');

    setTimeout(() => {
      $toast.addClass('invisible');

      $toast.on('transitionend', () => {
        $toast.remove();
      });
    }, duration);
  }
}
