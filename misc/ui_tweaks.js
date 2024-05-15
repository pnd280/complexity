class UITweaks {
  static alterSloganHeading(text = 'Chatplexity') {
    MyObserver.onElementExist({
      selector:
        '.mb-lg.flex.items-center.justify-center.pb-xs.md\\:text-center span',
      callback: ({ element }) => {
        if ($(element).text() !== text) $(element).text(text);
      },
      recurring: true,
    });
  }

  static closePopoversOnScroll() {
    $(window).scroll(() => {
      $('[id$="-popover"]').each((_, popover) => {
        $(popover).remove();
      });
    });
  }

  static setAccentColor(color) {
    if (!this.isValidHexColor(color)) {
      color = '#007aff';
    }

    $(':root').css('--accent-color', color);
    $(':root').css(
      '--accent-color-darker',
      this.darkenHexColor(color, 50) || color
    );
  }

  static isValidHexColor(hex) {
    const hexColorPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    return hexColorPattern.test(hex);
  }

  static darkenHexColor(hex, percent) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    const factor = (100 - percent) / 100;

    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);

    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    const darkenedHex = `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return darkenedHex;
  }
}
