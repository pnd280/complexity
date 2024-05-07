class ModelSelector {
  static updateChatModelFn;
  static updateImageModelFn;

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
    const queryLimit = data?.['gpt4_limit'];
    const opusQueryLimit = data?.['opus_limit'];
    const imageGenerationLimit = data?.['create_limit'];

    unsafeWindow.PERSISTENT_SETTINGS.chatModelCode =
      chatModelCode;
    unsafeWindow.PERSISTENT_SETTINGS.imageModelCode =
      imageModelCode;
    unsafeWindow.PERSISTENT_SETTINGS.queryLimit = queryLimit;
    unsafeWindow.PERSISTENT_SETTINGS.opusQueryLimit =
      opusQueryLimit;
    unsafeWindow.PERSISTENT_SETTINGS.imageGenerationLimit =
      imageGenerationLimit;

    return {
      chatModelCode,
      imageModelCode,
      queryLimit,
      opusQueryLimit,
      imageGenerationLimit,
    };
  }

  static getDefaultChatModelName() {
    const otherModelsQueryLimit =
      unsafeWindow.PERSISTENT_SETTINGS.queryLimit;
    const opusQueryLimit =
      unsafeWindow.PERSISTENT_SETTINGS.opusQueryLimit;

    const item = this.getPredefinedChatModels().find(
      (m) =>
        m.code === unsafeWindow.PERSISTENT_SETTINGS.chatModelCode
    );

    if (!item) return '';

    const currentModel = item?.dropdownTitle || item?.name || '';

    if (!currentModel) return '';

    let currentLimit;

    switch (unsafeWindow.PERSISTENT_SETTINGS.chatModelCode) {
      case 'claude3opus':
        currentLimit = opusQueryLimit;
        break;
      case 'turbo':
        currentLimit = 'UNL';
        break;
      default:
        currentLimit = otherModelsQueryLimit;
        break;
    }

    return {
      name: currentModel,
      limit: currentLimit,
    };
  }

  static getDefaultImageModelName() {
    const currentLimit =
      unsafeWindow.PERSISTENT_SETTINGS.imageGenerationLimit;

    const item = this.getPredefinedImageModels().find(
      (m) =>
        m.code ===
        unsafeWindow.PERSISTENT_SETTINGS.imageModelCode
    );

    if (!item) return '';

    const currentModelName = item?.dropdownTitle || item?.name || '';

    return {
      name: currentModelName,
      limit: currentLimit,
    };
  }

  static setChatModelName(selector, override) {
    const { name: chatModelName, limit: chatModelLimit } =
      override || this.getDefaultChatModelName();

    selector.setText(chatModelName);
    selector.$element.find('#query-limit').text(chatModelLimit);
  }

  static setImageModelName(selector, override) {
    const { name: imageModelName, limit: imageModelLimit } =
      override || this.getDefaultImageModelName();

    selector.setText(imageModelName);
    selector.$element.find('#query-limit').text(imageModelLimit);
  }

  static getPredefinedChatModels() {
    return [
      { name: 'GPT-4 Turbo', dropdownTitle: 'GPT-4', code: 'gpt4' },
      { name: 'Claude 3 Opus', dropdownTitle: 'Opus', code: 'claude3opus' },
      { name: 'Claude 3 Sonnet', dropdownTitle: 'Sonnet', code: 'claude2' },
      { name: 'Default', code: 'turbo' },
      { name: 'Sonar Large 32K', dropdownTitle: 'Sonar', code: 'experimental' },
      { name: 'Mistral Large', dropdownTitle: 'Mistral', code: 'mistral' },
    ];
  }

  static getPredefinedImageModels() {
    return [
      { name: 'DALL-E 3', dropdownTitle: 'DALL-E', code: 'dall-e-3' },
      { name: 'Playground', code: 'default' },
      { name: 'Stable Diffusion XL', dropdownTitle: 'SDXL', code: 'sdxl' },
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
    isImageModel &&
      (this.updateImageModelFn = ((selector) => {
        this.setImageModelName(selector);
      }).bind(this, selector));

    !isImageModel &&
      (this.updateChatModelFn = ((selector) => {
        this.setChatModelName(selector);
      }).bind(this, selector));

    selector.$element.click(async () => {
      const { $popover, addSelection } = UI.createSelectionPopover({
        sourceElement: selector.$element[0],
        sourceElementId: isImageModel
          ? 'image-model-selector'
          : 'model-selector',
      });

      if (!$popover) return;

      $('main').append($popover);

      const closePopover = () => QueryBox.closeAndRemovePopover($popover);

      models.forEach((model) => {
        addSelection({
          input: {
            name: model.name,
            onClick: async () => {
              try {
                await this.setModel(model.code, isImageModel);

                await this.getDefaultModels();

                isImageModel
                  ? this.setImageModelName(selector)
                  : this.setChatModelName(selector);
              } catch (error) {
                console.error('Failed to switch model', error);
                alert('Failed to switch model');
              } finally {
                closePopover();
              }
            },
          },
          isSelected:
            model.code ===
            unsafeWindow.PERSISTENT_SETTINGS[
              isImageModel ? 'imageModelCode' : 'chatModelCode'
            ],
        });
      });

      UI.showPopover({ $anchor: selector.$element, $popover });

      setTimeout(() => $(document).on('click', closePopover), 100);
    });
  }

  static async setModel(model, isImageModel) {
    await unsafeWindow.WSHOOK_INSTANCE.sendMessage({
      messageCode: 423,
      event: 'save_user_settings',
      data: {
        [isImageModel ? 'default_image_generation_model' : 'default_model']:
          model,
      },
    });
  }
}
