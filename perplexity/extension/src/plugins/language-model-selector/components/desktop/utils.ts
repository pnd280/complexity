export function getItemClassName(isHidden: boolean, baseClass: string) {
  return cn(baseClass, isHidden && "x:opacity-50");
}
