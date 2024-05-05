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
      getText: () => $dropdown.find('#text').text(),
    };
  }

  static createSelectionPopover(sourceElement, sourceElementId) {
    const ownPopoverId = `#${sourceElementId}-popover`;

    if ($(ownPopoverId).length) {
      return $(ownPopoverId).each((_, element) => {
        element.remove();
      });
    }

    if ($(`.popover:not(${ownPopoverId})`).length) {
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
    const $popper = $popover.find('[data-tag="popper"]');
    const $menuContaienr = $popover.find('[data-tag="menu"]');

    $popover.attr('id', `${sourceElementId}-popover`);

    if (sourceElement) {
      const { top, left, width, height, right } =
        sourceElement.getBoundingClientRect();

      const scrollY = window.scrollY || document.documentElement.scrollTop;

      $popper.css('left', `${left}px`);
      $popper.css('top', `${top + height + scrollY}px`);
    }

    return {
      $popover,
      addSelection: ({ input, isSelected }) => {
        const $selection = createSelectionElement(input);
        isSelected && $selection.addClass('selected', isSelected);
        $menuContaienr.append($selection);
      },
    };
  }
}
