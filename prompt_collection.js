class PromptCollection {
  static getPrompts() {
    const prompts =
      JSONUtils.safeParse(localStorage.getItem('customPrompts')) || [];

    const fitleredPrompts = prompts.filter((prompt) => {
      return prompt.id && prompt.title && prompt.prompt;
    });

    unsafeWindow.STORE.prompts = fitleredPrompts;

    this.savePrompts(fitleredPrompts);

    return fitleredPrompts;
  }

  static getPromptById(id) {
    return this.getPrompts().find((prompt) => prompt.id === id);
  }

  static savePrompt(prompt) {
    const prompts = this.getPrompts();

    const index = prompts.findIndex((p) => p.id === prompt.id);

    if (index === -1) {
      prompts.push(prompt);
    } else {
      prompts[index] = prompt;
    }

    this.savePrompts(prompts);
  }

  static savePrompts(prompts) {
    const filteredPrompts = prompts.filter((prompt) => {
      return prompt.id && prompt.title && prompt.prompt;
    });

    localStorage.setItem('customPrompts', JSON.stringify(filteredPrompts));
  }

  static reorderPrompts(activePrompt) {
    const prompts = this.getPrompts();

    const index = prompts.findIndex((p) => p.id === activePrompt.id);

    if (index === -1) {
      prompts.unshift(activePrompt);
    } else {
      prompts.splice(index, 1);
      prompts.unshift(activePrompt);
    }

    this.savePrompts(prompts);
  }

  static deletePrompt(id) {
    const prompts = this.getPrompts();

    const index = prompts.findIndex((prompt) => prompt.id === id);

    if (index === -1) return;

    if (unsafeWindow.STORE.activePromptId === id) {
      unsafeWindow.STORE.activePromptId = null;
    }

    prompts.splice(index, 1);

    this.savePrompts(prompts);
  }

  static getDropdownItems() {
    const prompts = [
      {
        title: 'No Prompt',
        dropdownTitle: 'Prompt',
        id: null,
      },
      ...this.getPrompts(),
    ];

    return prompts;
  }

  static getDefaultPromptTitle() {
    const activePromptId = unsafeWindow.STORE.activePromptId;

    const item = unsafeWindow.STORE.prompts?.find(
      (prompt) => prompt.id === activePromptId
    );

    return item?.dropdownTitle || item?.title || 'Prompt';
  }

  static createDropdown() {
    return DropdownUI.create({
      selectorClass: 'prompt-collection',
      svgIcon: 'script',
    });
  }

  static setupPromptModal({ id, title, fields, footerButtons }) {
    const $promptBox = window.$UI_HTML.find('#prompt-box-wrapper').clone();

    $promptBox
      .find('h1')
      .text(id ? `Edit ${title}'s Prompt` : 'Create new prompt');

    $promptBox.find('#backdrop').click(() => {
      close();
    });

    $promptBox.find('button[data-testid="close-modal"]').click(() => {
      close();
    });

    fields.forEach((field) => {
      const { title, description, optional, value, type } = field;

      switch (type) {
        case 'textarea':
          const $textarea = window.$UI_HTML
            .find('#prompt-box-textarea')
            .clone();
          $textarea.attr('field', title.toLowerCase());

          $textarea.find('#title').text(title);
          $textarea.find('#description').text(description);
          !optional && $textarea.find('#optional').remove();
          $textarea.find('textarea').text(value);

          $promptBox.find('#sections').append($textarea);

          countCharacters($textarea);
          $promptBox
            .find('textarea')
            .off('input')
            .on('input', function () {
              countCharacters($textarea);
            });

          break;
        case 'input':
          const $input = window.$UI_HTML.find('#prompt-box-input').clone();
          $input.attr('field', title.toLowerCase());

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
          $button = window.$UI_HTML.find('#prompt-box-primary-button').clone();
          break;
        case 'secondary':
          $button = window.$UI_HTML
            .find('#prompt-box-secondary-button')
            .clone();
          break;
      }

      $button.find('#text').text(text);

      $button.click(() => {
        const values = {};

        fields.forEach((field) => {
          const $field = $promptBox.find(
            `[field="${field.title.toLowerCase()}"]`
          );

          switch (field.type) {
            case 'textarea':
              values[field.title.toLowerCase()] = $field.find('textarea').val();
              break;
            case 'input':
              values[field.title.toLowerCase()] = $field.find('input').val();
              break;
          }
        });

        onClick(values);

        $promptBox.remove();
      });

      $promptBox.find('#footer').append($button);
    });

    $promptBox.appendTo('main');

    function countCharacters($textarea) {
      const $counter = $promptBox.find('#character-count');
      const length = $textarea.find('textarea').val().length;

      if (length > 1024 - 10) {
        $counter.removeClass('text-green');
        $counter.addClass('text-superAlt');
        $counter.text(`${1024 - length}`);
      } else {
        $counter.text('');
      }
    }

    function close() {
      $promptBox.addClass('invisible');

      $promptBox.on('transitionend', () => {
        $promptBox.remove();
      });
    }
  }

  static setupSelectionContextMenu(selector) {
    selector.$element.on('contextmenu', (e) => {
      e.preventDefault();

      if (unsafeWindow.STORE.activePromptId) return;

      const { $popover, addSelection } = DropdownUI.createSelectionPopover({
        sourceElement: null,
        sourceElementId: 'prompt-collection-context-menu',
      });

      if (!$popover) return;

      $('main').append($popover);

      const closePopover = () => QueryBox.closeAndRemovePopover($popover);

      addSelection({
        input: {
          name: 'Create new',
          onClick: () => {
            closePopover();
            this.setupPromptModal({
              fields: [
                {
                  title: 'Title',
                  description: 'The title of the prompt.',
                  optional: false,
                  type: 'input',
                },
                {
                  title: 'Prompt',
                  description:
                    '{{{query}}} will be replaced with the user query.',
                  optional: false,
                  type: 'textarea',
                },
              ],
              footerButtons: [
                {
                  type: 'primary',
                  text: 'Save',
                  onClick: ({ title, prompt }) => {
                    this.savePrompt({
                      id: Date.now(),
                      title,
                      prompt,
                    });

                    Toast.show({
                      message: 'Prompt created',
                    });
                  },
                },
              ],
            });
          },
        },
      });

      UI.showPopover({
        $anchor: selector.$element,
        $popover,
      });

      setTimeout(() => $(document).on('click', closePopover), 100);
    });
  }

  static setupSelector(selector) {
    selector.$element.off('click').on('click', () => {
      const prompts = this.getDropdownItems();

      const { $popover, addSelection } = DropdownUI.createSelectionPopover({
        sourceElement: selector.$element[0],
        sourceElementId: 'prompt-collection',
      });

      if (!$popover) return;

      $('main').append($popover);

      const closePopover = () => QueryBox.closeAndRemovePopover($popover);

      prompts.forEach((prompt) => {


        const $promptPreviewPopover = PromptCollectionUI.createPreviewPopover({
          content: prompt.prompt,
          footerButtons: [
            {
              text: 'Delete',
              svgIcon: 'trash',
              onClick: () => {
                this.deletePrompt(prompt.id);

                Toast.show({
                  message: 'Prompt deleted',
                });

                selector.setText(this.getDefaultPromptTitle());

                closePopover();
              },
            },
            {
              text: 'Edit',
              svgIcon: 'pen-clip',
              onClick: () => {
                this.setupPromptModal({
                  id: prompt.id,
                  title: prompt.title,
                  fields: [
                    {
                      title: 'Title',
                      description: 'The title of the prompt.',
                      optional: false,
                      value: prompt.title,
                      type: 'input',
                    },
                    {
                      title: 'Prompt',
                      description:
                        '{{{query}}} will be replaced with the user query.',
                      optional: false,
                      value: prompt.prompt,
                      type: 'textarea',
                    },
                  ],
                  footerButtons: [
                    {
                      type: 'primary',
                      text: 'Save',
                      onClick: ({ title: newTitle, prompt: newPrompt }) => {
                        this.savePrompt({
                          id: prompt.id,
                          title: newTitle,
                          prompt: newPrompt,
                        });

                        selector.setText(this.getDefaultPromptTitle());

                        Toast.show({
                          message: 'Prompt updated',
                        });
                      },
                    },
                  ],
                });

                closePopover();
              },
            },
            {
              text: 'Persist in this session',
            },
          ],
        });

        addSelection({
          input: {
            name: prompt.title,
            onMouseEnter: ($element) => {
              $('#prompt-box-popover').each((_, element) => {
                $(element).remove();
              });

              if (!prompt.id) return;

              $('main').append($promptPreviewPopover);

              UI.showPopover({
                $anchor: $element,
                $popover: $promptPreviewPopover,
                placement: 'horizontal',
              });
            },
            onMouseLeave: () => {
              Utils.bindIntervalToElement(
                $promptPreviewPopover[0],
                () => {
                  if ($promptPreviewPopover.is(':hover')) return;

                  QueryBox.closeAndRemovePopover($promptPreviewPopover);
                },
                200
              );
            },
            onClick: () => {
              closePopover();
              QueryBox.closeAndRemovePopover($promptPreviewPopover);

              unsafeWindow.STORE.activePromptId = prompt.id;

              this.reorderPrompts(prompt);

              selector.setText(this.getDefaultPromptTitle());

              $('main').toggleClass('prompt-applied', !!prompt.id);
            },
          },
          isSelected: prompt.id === unsafeWindow.STORE.activePromptId,
        });
      });

      UI.showPopover({
        $anchor: selector.$element,
        $popover,
      });

      setTimeout(() => $(document).on('click', closePopover), 100);
    });

    selector.$element.off('contextmenu').on('contextmenu', (e) => {
      e.preventDefault();

      if (!unsafeWindow.STORE.activePromptId) return;

      const prompt = this.getPromptById(unsafeWindow.STORE.activePromptId);

      const $promptPreviewPopover = PromptCollectionUI.createPreviewPopover({
        content: prompt.prompt,
        footerButtons: [
          {
            text: 'Delete',
            svgIcon: 'trash',
            onClick: () => {
              this.deletePrompt(prompt.id);

              Toast.show({
                message: 'Prompt deleted',
              });

              selector.setText(this.getDefaultPromptTitle());

              QueryBox.closeAndRemovePopover($promptPreviewPopover);
            },
          },
          {
            text: 'Edit',
            svgIcon: 'pen-clip',
            onClick: () => {
              QueryBox.closeAndRemovePopover($promptPreviewPopover);

              this.setupPromptModal({
                id: prompt.id,
                title: prompt.title,
                fields: [
                  {
                    title: 'Title',
                    description: 'The title of the prompt.',
                    optional: false,
                    value: prompt.title,
                    type: 'input',
                  },
                  {
                    title: 'Prompt',
                    description:
                      '{{{query}}} will be replaced with the user query.',
                    optional: false,
                    value: prompt.prompt,
                    type: 'textarea',
                  },
                ],
                footerButtons: [
                  {
                    type: 'primary',
                    text: 'Save',
                    onClick: ({ title: newTitle, prompt: newPrompt }) => {
                      this.savePrompt({
                        id: prompt.id,
                        title: newTitle,
                        prompt: newPrompt,
                      });

                      selector.setText(this.getDefaultPromptTitle());

                      Toast.show({
                        message: 'Prompt updated',
                      });
                    },
                  },
                ],
              });
            },
          },
          {
            text: 'Persist in this session',
          },
        ],
      });

      $('main').append($promptPreviewPopover);

      UI.showPopover({
        $anchor: selector.$element,
        $popover: $promptPreviewPopover,
      });

      selector.$element.off('mouseleave').on('mouseleave', () => {
        Utils.bindIntervalToElement(
          $promptPreviewPopover[0],
          () => {
            if ($promptPreviewPopover.is(':hover')) return;

            QueryBox.closeAndRemovePopover($promptPreviewPopover);
          },
          200
        );
      });
    });

    this.setupSelectionContextMenu(selector);
  }
}
