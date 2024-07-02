import $ from 'jquery';

type ScrollCallback = () => void;

function onScrollDirectionChange({
  up,
  down,
  identifier,
}: {
  up?: ScrollCallback;
  down?: ScrollCallback;
  identifier: string;
}) {
  let lastScrollTop = 0;

  $(window).on(`scroll.${identifier}`, function () {
    const currentScrollTop = $(this).scrollTop();

    if (typeof currentScrollTop === 'undefined') return;

    if (currentScrollTop > lastScrollTop) {
      down?.();
    } else {
      up?.();
    }

    lastScrollTop = currentScrollTop;
  });

  return () => $(window).off(`scroll.${identifier}`);
}

const observer = {
  onScrollDirectionChange,
};

export default observer;
