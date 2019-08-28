export {};

declare global {
  interface Window {
    app: any;
    CONSTANTS: any;
    moment: any;
    ice: any;
    $: any;
    tracker: any;
    AudioContext: any;
    webkitAudioContext: any;

  }
  interface Navigator {
    webkitGetUserMedia: any;
    mozGetUserMedia: any;
    cancelAnimationFrame: any;
    webkitCancelAnimationFrame: any;
    mozCancelAnimationFrame: any;
    requestAnimationFrame: any;
    webkitRequestAnimationFrame: any;
    mozRequestAnimationFrame: any;
  }
}
