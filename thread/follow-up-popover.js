class FollowUpPopover {
  static setupPromptDropdown({ $anchor, selectedText }) {
    const prompts = PromptCollection.getDropdownItems();

    const { $popover, addSelection } = DropdownUI.createSelectionPopover({
      sourceElement: $anchor[0],
      sourceElementId: 'prompt-collection',
    });

    if (!$popover) return;

    $('main').append($popover);

    const closePopover = () => UI.closeAndRemovePopover($popover);

    prompts.forEach((prompt) => {
      if (PromptCollection.isInstantPrompt(prompt) || !prompt.id) return;

      let $promptPreviewPopover;

      addSelection({
        input: {
          name: prompt.title,
          onClick: async () => {
            closePopover();
            UI.closeAndRemovePopover($promptPreviewPopover?.$popover);

            const $textarea = UI.findActiveQueryBoxTextarea();
            const $submitButton = UI.findActiveSubmitQueryButton();

            const modifiedText =
              prompt?.prompt.replace('{{{query}}}', selectedText) ??
              selectedText;

            Utils.setReactTextareaValue($textarea[0], modifiedText);

            while ($submitButton.is(':disabled')) {
              await Utils.sleep(10);
              if ($textarea.text() !== modifiedText) {
                return;
              }
            }

            $submitButton.click();

            PromptCollection.reorderPrompts(prompt);
          },
        },
      });
    });

    UI.showPopover({
      $anchor,
      $popover,
      placement: 'horizontal',
      offset: {
        x: -10,
      },
    });

    setTimeout(() => $(document).on('click', closePopover), 100);
  }

  static setupPopover({
    anchorTop,
    anchorWidth,
    anchorLeft,
    anchorHeight,
    lineHeight,
    selectedText,
  }) {
    $('#follow-up-popover').remove();

    const $element = $UI_TEMPLATE.find('#follow-up-popover').clone();

    $('main').append($element);

    const scrollY = window.scrollY || document.documentElement.scrollTop;

    const $stickyHeader = UI.getStickyHeader();

    let finalTop = anchorTop - lineHeight - 25 + scrollY;

    if (finalTop < $stickyHeader.height() + 25 + scrollY) {
      finalTop = anchorTop + anchorHeight + 10 + scrollY;
      $element.addClass('reverse-arrow');
    }

    $element.css({
      top: finalTop,
      left: anchorLeft + anchorWidth / 2 - $element.width() / 2,
    });

    $element.find('#ask').on('click', async () => {
      const $textarea = UI.findActiveQueryBoxTextarea();
      const $submitButton = UI.findActiveSubmitQueryButton();

      Utils.setReactTextareaValue($textarea[0], selectedText);

      while ($submitButton.is(':disabled')) {
        await Utils.sleep(10);
        if ($textarea.text() !== selectedText) {
          return;
        }
      }

      $submitButton.click();
    });

    $element.find('#append').on('click', () => {
      const $textarea = UI.findActiveQueryBoxTextarea();

      Utils.setReactTextareaValue(
        $textarea[0],
        $textarea.text() + ' ' + selectedText
      );

      $textarea.focus();
    });

    $element.find('#prompt').on('click', (e) => {
      e.stopPropagation();

      this.setupPromptDropdown({ $anchor: $element, selectedText });
    });

    setTimeout(() => {
      $(document).on('click', (e) => closePopover.bind(null, e)());
    }, 100);

    function closePopover(e) {
      e.stopPropagation();

      $element.addClass('invisible');

      $element.on('transitionend', () => {
        $element.remove();
      });

      $(document).off('click', closePopover);
    }
  }

  static observeSelectedText(container, callback) {
    let selectionRange = null;
    let isMouseDown = false;

    const handleMouseDown = () => {
      isMouseDown = true;
    };

    const handleMouseUp = async (e) => {
      e.stopPropagation();

      await Utils.sleep(10);

      isMouseDown = false;
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        selectionRange = selection.getRangeAt(0);
        const containerRect = container.getBoundingClientRect();
        const selectionRect = selectionRange.getBoundingClientRect();

        if (
          containerRect.left <= selectionRect.left &&
          containerRect.right >= selectionRect.right &&
          containerRect.top <= selectionRect.top &&
          containerRect.bottom >= selectionRect.bottom &&
          selectionRange.toString().trim() !== ''
        ) {
          const selectedText = selectionRange.toString();

          const selectionData = {
            text: selectedText,
            top: selectionRect.top,
            left: selectionRect.left,
            width: selectionRect.width,
            height: selectionRect.height,
            lineHeight: parseFloat(
              window.getComputedStyle(container).lineHeight
            ),
          };
          callback(selectionData);
        }
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', (e) => handleMouseUp(e));

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
    };
  }

  static mountObserver() {
    // $(window).on('scroll', (e) => {
    //   e.stopPropagation();
    // });

    MyObserver.onElementExist({
      selector: () => UI.getMessageBlocks().map(({ $answer }) => $answer[0]),
      callback: ({ element }) => {
        this.observeSelectedText(
          element,
          ({ text, top, left, width, height, lineHeight }) => {
            if (text.length === 0) return;

            this.setupPopover({
              selectedText: text,
              lineHeight,
              anchorTop: top,
              anchorLeft: left,
              anchorWidth: width,
              anchorHeight: height,
            });
          }
        );
      },
    });
  }
}
