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
      unsafeWindow.STORE.persistPrompt = false;
    }

    prompts.splice(index, 1);

    this.savePrompts(prompts);
  }

  static isInstantPrompt(prompt) {
    if (!prompt || !prompt.id) {
      return;
    }

    return !prompt.prompt?.includes('{{{query}}}');
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

  static setupSelectionContextMenu($anchor) {
    $('#prompt-box-popover').each((_, element) => {
      $(element).remove();
    });

    const { $popover, addSelection } = DropdownUI.createSelectionPopover({
      sourceElement: null,
      sourceElementId: 'prompt-collection-context-menu',
    });

    if (!$popover) return;

    $('main').append($popover);

    const closePopover = () => UI.closeAndRemovePopover($popover);

    addSelection({
      input: {
        name: 'Create new',
        onClick: () => {
          closePopover();
          PromptBoxUI.show({
            title: 'Create new prompt',
            fields: [
              {
                title: 'Title',
                fieldName: 'title',
                description: 'The title of the prompt.',
                optional: false,
                type: 'input',
              },
              {
                title: 'Prompt',
                fieldName: 'prompt',
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
                  if (!title || !prompt) {
                    return Toast.show({
                      message: '❌ Title and prompt are required',
                    });
                  }

                  this.savePrompt({
                    id: Date.now(),
                    title,
                    prompt,
                  });

                  Toast.show({
                    message: '✅ Prompt created',
                  });
                },
              },
            ],
          });
        },
      },
    });

    addSelection({
      input: {
        name: 'Import',
        onClick: () => {
          closePopover();

          PromptBoxUI.show({
            title: 'Import Prompts',
            fields: [
              {
                title: 'Prompts',
                fieldName: 'prompts',
                description: 'Paste the prompts JSON here.',
                optional: false,
                type: 'textarea',
              },
            ],
            footerButtons: [
              {
                type: 'primary',
                text: 'Import',
                onClick: ({ prompts }) => {
                  const parsedPrompts = JSONUtils.safeParse(prompts);

                  if (!Array.isArray(parsedPrompts)) {
                    return Toast.show({
                      message: '❌ Invalid JSON',
                    });
                  }

                  this.savePrompts(parsedPrompts);

                  Toast.show({
                    message: '✅ Prompts imported',
                  });
                },
              },
            ],
          });
        },
      },
    });

    addSelection({
      input: {
        name: 'Export',
        onClick: () => {
          closePopover();

          navigator.clipboard.writeText(
            JSON.stringify(this.getPrompts(), null, 2)
          );

          Toast.show({
            message: '✅ All prompts have been copied to the clipboard',
          });
        },
      },
    });

    UI.showPopover({
      $anchor,
      $popover,
    });

    setTimeout(() => $(document).on('click', closePopover), 100);
  }

  static setupSelectionPreview({ prompt, footerButtons }) {
    const $popover = PromptCollectionUI.createPreviewPopover({
      content: prompt.prompt,
      footerButtons,
    });

    return {
      $popover,
      close: () => {
        if (!document.contains($popover?.[0]) || $popover.is(':hover')) return;

        UI.closeAndRemovePopover($popover);
      },
    };
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

      const closePopover = () => UI.closeAndRemovePopover($popover);

      prompts.forEach((prompt) => {
        let $promptPreviewPopover;

        addSelection({
          input: {
            name: prompt.title,
            onMouseEnter: ($element) => {
              if (!prompt.id) return;

              $promptPreviewPopover = this.setupSelectionPreview({
                prompt,
                footerButtons: [
                  {
                    text: 'Copy',
                    svgIcon: 'copy',
                    onClick: () => {
                      navigator.clipboard.writeText(prompt.prompt);

                      Toast.show({
                        message: '✅ Prompt copied',
                      });

                      closePopover();
                    },
                  },
                  {
                    text: 'Delete',
                    svgIcon: 'trash',
                    onClick: () => {
                      this.deletePrompt(prompt.id);

                      Toast.show({
                        message: '✅ Prompt deleted',
                      });

                      selector.setText({ text: this.getDefaultPromptTitle() });

                      closePopover();
                    },
                  },
                  {
                    text: 'Edit',
                    svgIcon: 'pen-clip',
                    onClick: () => {
                      PromptBoxUI.show({
                        title: `Edit ${prompt.title}`,
                        fields: [
                          {
                            title: 'Title',
                            fieldName: 'title',
                            description: 'The title of the prompt.',
                            optional: false,
                            value: prompt.title,
                            type: 'input',
                          },
                          {
                            title: 'Prompt',
                            fieldName: 'prompt',
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
                            onClick: ({
                              title: newTitle,
                              prompt: newPrompt,
                            }) => {
                              if (!newTitle || !newPrompt) {
                                return Toast.show({
                                  message: '❌ Title and prompt are required',
                                });
                              }

                              this.savePrompt({
                                id: prompt.id,
                                title: newTitle,
                                prompt: newPrompt,
                              });

                              selector.setText({
                                text: this.getDefaultPromptTitle(),
                              });

                              Toast.show({
                                message: '✅ Prompt updated',
                              });
                            },
                          },
                        ],
                      });

                      closePopover();
                    },
                  },
                ],
              });

              $('main').append($promptPreviewPopover.$popover);

              UI.showPopover({
                $anchor: $element,
                $popover: $promptPreviewPopover.$popover,
                placement: 'horizontal',
              });
            },
            onMouseLeave: () => {
              MyObserver.bindIntervalToElement(
                $promptPreviewPopover?.$popover?.[0],
                $promptPreviewPopover?.close,
                200
              );
            },
            onClick: async () => {
              closePopover();
              UI.closeAndRemovePopover($promptPreviewPopover?.$popover);

              const $closestTextarea = UI.findActiveQueryBoxTextarea();

              if (this.isInstantPrompt(prompt)) {
                unsafeWindow.STORE.activePromptId = null;
                unsafeWindow.STORE.persistPrompt = false;

                Utils.setReactTextareaValue($closestTextarea[0], prompt.prompt);

                const $submitButton = UI.findActiveSubmitQueryButton();

                while ($submitButton.is(':disabled')) {
                  await Utils.sleep(10);
                  if ($closestTextarea.text() !== prompt.prompt) {
                    return;
                  }
                }

                $submitButton.click();
              } else {
                unsafeWindow.STORE.activePromptId = prompt.id;
                unsafeWindow.STORE.persistPrompt = false;

                $('main').toggleClass('prompt-applied', !!prompt?.id);

                $closestTextarea.focus();
              }

              this.reorderPrompts(prompt);

              selector.setText({ text: this.getDefaultPromptTitle() });
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

    selector.$element.on('contextmenu', (e) => {
      e.preventDefault();

      this.setupSelectionContextMenu(selector.$element);
    });

    selector.$element.off('mouseenter').on('mouseenter', () => {
      if (!unsafeWindow.STORE.activePromptId) return;

      const prompt = this.getPrompts().find(
        (prompt) => prompt.id === unsafeWindow.STORE.activePromptId
      );

      if (!prompt) return;

      const $promptPreviewPopover = this.setupSelectionPreview({
        prompt,
        footerButtons: [
          {
            text: 'Copy',
            svgIcon: 'copy',
            onClick: () => {
              navigator.clipboard.writeText(prompt.prompt);

              Toast.show({
                message: '✅ Prompt copied',
              });
            },
          },
          {
            text: 'Unapply',
            onClick: () => {
              unsafeWindow.STORE.activePromptId = null;
              unsafeWindow.STORE.persistPrompt = false;

              selector.setText({ text: this.getDefaultPromptTitle() });

              $('main').toggleClass('prompt-applied', false);
            },
          },
          {
            text: !unsafeWindow.STORE.persistPrompt ? 'Persist' : 'One-time',
            enabled: !this.isInstantPrompt(prompt),
            onClick: () => {
              unsafeWindow.STORE.persistPrompt =
                !unsafeWindow.STORE.persistPrompt;
            },
          },
        ],
      });

      const { $popover, close } = $promptPreviewPopover;

      $('main').append($popover);

      UI.showPopover({
        $anchor: selector.$element,
        $popover,
      });

      if (typeof close === 'function') {
        selector.$element.off('mouseleave').on('mouseleave', () => {
          MyObserver.bindIntervalToElement($popover[0], close, 200);
        });
      }
    });
  }
}
