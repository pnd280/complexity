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
      setText: (text) => {
        $dropdown.find('#text').text(text);
      },
    };
  }

  static createSelectionPopover(sourceElement) {
    if ($('[data-tag="popper"]').length)
      return $('[data-tag="popper"]').remove();

    const createSelectionElement = (input) => {
      const { name, onClick } = input;
      const $element = $UI_HTML.find('#selection').clone();

      $element.find('span#name').text(name);

      $element.click(onClick);
      return $element;
    };

    const $popoverHTML = $UI_HTML.find('#popover').clone();

    const $popover = $($popoverHTML);
    const $popper = $popover.find('[data-tag="popper"]');
    const $menuContaienr = $popover.find('[data-tag="menu"]');

    if (sourceElement) {
      const { top, left, width, height } =
        sourceElement.getBoundingClientRect();
      const popperWidth = $popper.outerWidth();
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      $popper.css(
        'transform',
        `translate(${left + (width + popperWidth * 2) - scrollX + 32}px, ${
          top + height + scrollY
        }px)`
      );
    }

    return {
      $popover,
      addSelection: (input) => {
        const $selection = createSelectionElement(input);
        $menuContaienr.append($selection);
      },
    };
  }
}
