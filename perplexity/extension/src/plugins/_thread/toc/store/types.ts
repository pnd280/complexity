export type TocItem = {
  id: number;
  title: string;
  element: JQuery<Element>;
  isActive?: boolean;
  isActiveTopMost?: boolean;
};

export type PanelPosition = {
  position: { left: number };
  isOverflowing: boolean;
  width: number;
};
