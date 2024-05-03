class RightSideBar {
  static #createRightSideBarToggleButton() {
    const button = $(`
      <div class="relative  w-full px-two justify-center border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50  dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-transparent">
      <div class="px-xs overflow-hidden transition duration-300 relative">
        <button class="md:hover:bg-offsetPlus text-textOff dark:text-textOffDark md:hover:text-textMain dark:md:hover:bg-offsetPlusDark  dark:md:hover:text-textMainDark py-md  font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-in-out font-sans  select-none items-center relative group/button  justify-center text-center items-center rounded cursor-point active:scale-95 origin-center whitespace-nowrap flex w-full text-base aspect-square h-10">
          <div class="flex items-center leading-none justify-center w-full gap-xs">
            <svg
              width="35"
              height="35px"
              viewBox="-2.4 -2.4 28.80 28.80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {' '}
                <path
                  d="M13 5V19M16 8H18M16 11H18M16 14H18M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z"
                  stroke="#8d9191"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{' '}
              </g>
            </svg>
          </div>
        </button>
      </div>
    </div>
    `);

    return button;
  }

  static #clearEmptyContainer() {
    const container = $(
      '.pb-\\[124px\\].pt-md.md\\:pt-0 > div > div:nth-child(1)'
    ).children();

    container.each((index, element) => {
      if (
        $(element)
          .find('> div > div > div > div')
          .eq(1)
          .find('> div > div')
          .children().length < 1
      ) {
        $(element).find('> div > div > div > div').eq(1).remove();
        $(element).find('> div > div > div > div').eq(0).removeClass('col-span-8').addClass('col-span-12');
      }
    });
  }

  static init() {
    setInterval(() => {
      this.#clearEmptyContainer();
    }, 500);
  }
}