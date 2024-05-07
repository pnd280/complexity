class UI {
  static createDropdown({ selectorClass, svgIcon = 'bars-filter' }) {
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

  static showPopover({ $anchor, $popover, placement = 'vertical' }) {
    if (!$anchor) return;

    const { top, left, height } = $anchor[0].getBoundingClientRect();

    const scrollY = window.scrollY || document.documentElement.scrollTop;

    const $popper = $popover.find('[data-tag="popper"]');

    let popperLeft;
    let popperTop;

    const bottomOverflowed =
      top + height + $popper.height() > window.innerHeight;

    const RightOverflowed = left + $popper.width() > window.innerWidth;

    if (placement === 'vertical') {
      popperTop =
        scrollY + (bottomOverflowed ? top - $popper.height() : top + height);
      popperLeft = RightOverflowed ? left - $popper.width() : left;
    } else {
      popperTop = top + scrollY;
      popperLeft = RightOverflowed
        ? left - $anchor.width() - 5
        : left + $anchor.width() + 5;
    }

    $popper.css('left', `${popperLeft}px`);
    $popper.css('top', `${popperTop}px`);
  }

  static createSelectionPopover(
    { sourceElement, sourceElementId, isContextMenu } = {
      isContextMenu: false,
    }
  ) {
    const ownPopoverId = `#${sourceElementId}-popover`;

    if ($(ownPopoverId).length) {
      $(ownPopoverId).each((_, element) => {
        element.remove();
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
      const { name, onClick } = input;
      const $element = $UI_HTML.find('#selection').clone();

      $element.find('span#name').text(name);

      $element.click(onClick);

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
