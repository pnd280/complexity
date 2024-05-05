class ModelSelector {
  static async fetchSettings() {
    const url = 'https://www.perplexity.ai/p/api/v1/user/settings';

    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch settings');

    const data = await response.json();

    return data;
  }

  static async getDefaultModels() {
    const data = await this.fetchSettings();

    const chatModelCode = data?.['default_model'];
    const imageModelCode = data?.['default_image_generation_model'];

    unsafeWindow.WSHOOK_INSTANCE.persistentSettings.chatModelCode =
      chatModelCode;
    unsafeWindow.WSHOOK_INSTANCE.persistentSettings.imageModelCode =
      imageModelCode;

    return {
      chatModelCode,
      imageModelCode,
    };
  }

  static getDefaultChatModelName() {
    return (
      this.getPredefinedChatModels().find(
        (m) =>
          m.code ===
          unsafeWindow.WSHOOK_INSTANCE.persistentSettings.chatModelCode
      )?.name || ''
    );
  }

  static getDefaultImageModelName() {
    return (
      this.getPredefinedImageModels().find(
        (m) =>
          m.code ===
          unsafeWindow.WSHOOK_INSTANCE.persistentSettings.imageModelCode
      )?.name || ''
    );
  }

  static getPredefinedChatModels() {
    return [
      { name: 'GPT-4', code: 'gpt4' },
      { name: 'Claude Opus', code: 'claude3opus' },
      { name: 'Claude Sonnet', code: 'claude2' },
      { name: 'Default', code: 'turbo' },
      { name: 'Sonar Large 32K', code: 'experimental' },
      { name: 'Mistral Large', code: 'mistral' },
    ];
  }

  static getPredefinedImageModels() {
    return [
      { name: 'DALL-E 3', code: 'dall-e-3' },
      { name: 'Playground', code: 'default' },
      { name: 'SDXL', code: 'sdxl' },
    ];
  }

  static createChatModelDropdown() {
    return UI.createDropdown({
      selectorClass: 'model-selector',
      svgIcon: 'cpu',
    });
  }

  static createImageModelDropdown() {
    return UI.createDropdown({
      selectorClass: 'image-model-selector',
      svgIcon: 'image',
    });
  }

  static setupSelector(selector, models, isImageModel) {
    selector.$element.click(async () => {
      const { $popover, addSelection } = UI.createSelectionPopover(
        selector.$element[0],
        isImageModel ? 'image-model-selector' : 'model-selector'
      );

      if (!$popover) return;

      $('main').append($popover);

      const closePopover = () => QueryBox.closeAndRemovePopover($popover);

      models.forEach((model) => {
        addSelection({
          input: {
            name: model.name,
            onClick: async () => {
              const oldModelName = selector.getText();
              selector.setText(model.name);

              try {
                this.setModel(model.code, isImageModel);

                if (isImageModel) {
                  unsafeWindow.WSHOOK_INSTANCE.persistentSettings.imageModelCode =
                    model.code;
                } else {
                  unsafeWindow.WSHOOK_INSTANCE.persistentSettings.chatModelCode =
                    model.code;
                }

                this.getDefaultModels();
              } catch (error) {
                console.error('Failed to switch model', error);
                alert('Failed to switch model');
                selector.setText(oldModelName);
              } finally {
                closePopover();
              }
            },
          },
          isSelected:
            model.code ===
            unsafeWindow.WSHOOK_INSTANCE.persistentSettings[
              isImageModel ? 'imageModelCode' : 'chatModelCode'
            ],
        });
      });

      setTimeout(() => $(document).on('click', closePopover), 100);
    });
  }

  static async setModel(model, isImageModel) {
    const settingsKey = isImageModel
      ? 'default_image_generation_model'
      : 'default_model';
    await unsafeWindow.WSHOOK_INSTANCE.sendMessage({
      messageCode: 423,
      event: 'save_user_settings',
      data: {
        [settingsKey]: model,
      },
    });
  }
}
