/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

declare module '*?script&module' {
  const content: any;
  export default content;
}
