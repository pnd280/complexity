class UI {
  static showPopover({ $anchor, $popover, placement = 'vertical', offset }) {
    if (!$anchor) return;

    const { top, left, height } = $anchor[0].getBoundingClientRect();

    const scrollY = window.scrollY || document.documentElement.scrollTop;

    const $popper = $popover.find('[data-tag="popper"]');

    let popperLeft;
    let popperTop;

    const bottomOverflowed =
      top + height + $popper.outerHeight() > window.innerHeight;

    const rightOverflowed = left + $popper.outerWidth() > window.innerWidth;

    if (placement === 'vertical') {
      popperTop =
        scrollY +
        (bottomOverflowed ? top - $popper.outerHeight() : top + height);
      popperLeft = rightOverflowed ? left - $popper.outerWidth() : left;
    } else {
      popperTop = top + scrollY;
      popperLeft = rightOverflowed
        ? left - $anchor.outerWidth() - 5
        : left + $anchor.outerWidth() + 5;
    }

    if (
      placement === 'horizontal' &&
      bottomOverflowed &&
      popperTop + $popper.height() > window.innerHeight
    ) {
      popperTop = scrollY + window.innerHeight - $popper.outerHeight() - 20;
    }

    $popper.css('top', `${popperTop + (offset?.y || 0)}px`);
    $popper.css('left', `${popperLeft + (offset?.x || 0)}px`);
  }

  static closeAndRemovePopover($popover) {
    $popover?.remove();
    $(document).off('click', this.closeAndRemovePopover);
  }

  static setDropdownText({
    $dropdown,
    text,
    icon = undefined,
    emoji = undefined,
  }) {
    $dropdown.find('#text').text(text);

    if (icon) {
      $dropdown.find('button > div#emoji').remove();
      $dropdown.find('button > svg').remove();
      $dropdown
        .find('button')
        .prepend(
          $UI_TEMPLATE.find(`svg[data-icon="${icon}"]`).clone().addClass('mr-1')
        );
    }

    if (emoji) {
      $dropdown.find('button > div#emoji').remove();
      $dropdown.find('button > svg').remove();
      $dropdown
        .find('button')
        .prepend(`<div id="emoji" class="mr-1">${emoji}</div>`);
    }
  }

  static getCollapsibleSidebar() {
    return $(
      '.sticky.top-0.flex.h-full.flex-col.justify-between.overflow-y-auto.overflow-x-hidden'
    );
  }

  static getMessageContainer() {
    // user's thread
    let $messageContainer = $(
      '.h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child > div:first-child > div:first-child > div'
    );

    // branched thread
    if (!$messageContainer.length) {
      $messageContainer = $(
        '.h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child > div:first-child > div:nth-child(2)'
      );
    }

    return $messageContainer;
  }

  static getMessageBlocks() {
    if (Utils.whereAmI() !== 'thread') return [];

    const $messageContainer = this.getMessageContainer();

    const messageBlocks = [];

    $messageContainer.children().each((_, messageBlock) => {
      const $messageBlock = $(messageBlock);
      const $query = $messageBlock.find('.my-md.md\\:my-lg');
      const $answer = $messageBlock.find(
        '.relative.default.font-sans.text-base'
      );
      const $answerHeading = $messageBlock.find(
        '.mb-sm.flex.w-full.items-center.justify-between:last'
      );

      $messageBlock.find('.col-span-8:last').addClass('message-col');
      $messageBlock.find('.col-span-4:last').addClass('visual-col');

      const messageBlockData = {
        $messageBlock,
        $answerHeading,
        $query,
        $answer,
      };

      messageBlocks.push(messageBlockData);
    });

    return messageBlocks;
  }

  static getStickyHeader() {
    return $('.sticky.left-0.right-0.top-0.z-20.border-b');
  }

  static findActiveQueryBoxTextarea() {
    return $('.prompt-collection:last').parents().find('textarea:last');
  }

  static findActiveSubmitQueryButton() {
    return this.findActiveQueryBoxTextarea()
      .parents()
      .find('button[aria-label="Submit"]:last');
  }
}

class DropdownUI {
  static create({ selectorClass, svgIcon = 'bars-filter' }) {
    const $dropdown = $UI_TEMPLATE.find('#dropdown-wrapper').clone();

    $dropdown.find('button').addClass(`${selectorClass}`);

    $dropdown.find('#text').addClass(`${selectorClass}-text`);
    $dropdown
      .find('button')
      .prepend(
        $UI_TEMPLATE
          .find(`svg[data-icon="${svgIcon}"]`)
          .clone()
          .addClass('mr-1')
      );

    return {
      $element: $dropdown,
      setText: ({ text, icon = undefined, emoji = undefined }) => {
        UI.setDropdownText({ $dropdown, text, icon, emoji });
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
      const $element = $UI_TEMPLATE.find('#selection').clone();

      $element.find('span#name').text(name);

      $element.on('click', onClick);
      $element.on('mouseenter', onMouseEnter?.bind(null, $element));
      $element.on('mouseleave', onMouseLeave);

      return $element;
    };

    const $popoverHTML = $UI_TEMPLATE.find('#popover').clone();

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

class PromptBoxUI {
  static show({ title, fields, footerButtons }) {
    const $promptBox = $UI_TEMPLATE.find('#prompt-box-wrapper').clone();

    $promptBox.find('#backdrop').on('click', () => {
      close();
    });

    $promptBox.find('button[data-testid="close-modal"]').on('click', () => {
      close();
    });

    $promptBox.find('h1').text(title);

    fields.forEach((field) => {
      const {
        fieldName,
        title,
        description,
        optional,
        value,
        type,
        limit = 15000,
      } = field;

      switch (type) {
        case 'textarea':
          const $textarea = $UI_TEMPLATE.find('#prompt-box-textarea').clone();
          $textarea.attr('field', fieldName);

          $textarea.find('#title').text(title);
          $textarea.find('#description').text(description);
          !optional && $textarea.find('#optional').remove();
          $textarea.find('textarea').text(value);

          $promptBox.find('#sections').append($textarea);

          countCharacters($textarea, limit);

          $promptBox
            .find('textarea')
            .off('input')
            .on('input', function () {
              countCharacters($textarea, limit);
            });

          break;
        case 'input':
          const $input = $UI_TEMPLATE.find('#prompt-box-input').clone();
          $input.attr('field', fieldName);

          $input.find('#title').text(title);
          $input.find('#description').text(description);
          !optional && $input.find('#optional').remove();
          $input.find('input').val(value);

          $promptBox.find('#sections').append($input);

          break;
      }
    });

    footerButtons.forEach((button) => {
      const { text, onClick, type } = button;

      let $button;

      switch (type) {
        case 'primary':
          $button = $UI_TEMPLATE.find('#prompt-box-primary-button').clone();
          break;
        case 'secondary':
          $button = $UI_TEMPLATE.find('#prompt-box-secondary-button').clone();
          break;
      }

      $button.find('#text').text(text);

      $button.on('click', () => {
        const values = {};

        fields.forEach((field) => {
          const { fieldName, limit = 15000 } = field;

          const $field = $promptBox.find(`[field="${fieldName}"]`);

          switch (field.type) {
            case 'textarea':
              values[fieldName] = $field.find('textarea').val();
              break;
            case 'input':
              values[fieldName] = $field.find('input').val();
              break;
          }

          if (values[fieldName].length > limit) {
            Toast.show({
              message: `❌ Exceeds character limit!`,
            });

            throw new Error('Exceeds character limit!');
          }
        });

        onClick(values);

        $promptBox.remove();
      });

      $promptBox.find('#footer').append($button);
    });

    $promptBox.appendTo('main');

    function countCharacters($textarea, limit = 2000) {
      const $counter = $promptBox.find('#character-count');
      const length = $textarea.find('textarea').val().length;

      if (length > limit - 10) {
        $counter.removeClass('text-green');
        $counter.addClass('text-superAlt');
        $counter.text(`${limit - length}`);
      } else {
        $counter.text('');
      }

      return length;
    }

    function close() {
      $promptBox.addClass('invisible');

      $promptBox.on('transitionend', () => {
        $promptBox.remove();
      });
    }
  }
}

class PromptCollectionUI {
  static createPreviewPopover({ content, footerButtons }) {
    $('#prompt-box-popover').each((_, element) => {
      element.remove();
    });

    const $popover = $UI_TEMPLATE.find('#prompt-box-popover').clone();

    $popover.find('#content').text(content);

    !footerButtons?.length && $popover.find('#footer').remove();

    footerButtons &&
      footerButtons.forEach((button) => {
        const { text, svgIcon, onClick, enabled = true } = button;

        if (!enabled) return;

        const $button = $UI_TEMPLATE.find('#prompt-box-popover-button').clone();

        !svgIcon && $button.find('#icon').remove();

        svgIcon &&
          $button
            .find('#icon')
            .html($UI_TEMPLATE.find(`svg[data-icon="${svgIcon}"]`).clone());

        $button.find('#text').text(text);

        $button.on('click', () => {
          const content = $popover.find('#content').text();

          onClick(content);

          UI.closeAndRemovePopover($popover);
        });

        $popover.find('#footer').append($button);
      });

    return $popover;
  }
}

class Toast {
  static show({ message, prefix, duration = 2000 }) {
    const $toast = $UI_TEMPLATE.find('#toast-wrapper').clone();

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
