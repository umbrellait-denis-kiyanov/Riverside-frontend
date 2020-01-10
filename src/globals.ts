export {};

declare global {
  interface Window {
    app: any;
    CONSTANTS: any;
    moment: any;
    ice: any;
    AudioContext: any;
    webkitAudioContext: any;
  }
}
