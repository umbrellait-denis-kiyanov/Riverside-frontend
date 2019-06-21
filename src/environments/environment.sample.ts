export const environment = {
    production: false,
    serverUrl: 'https://recorder-us1.english3.com:9002',
    s3Url: 'https://s3.us-west-2.amazonaws.com/english3'
  };
declare global {
  interface Window { CONSTANTS: any; }
}
window.CONSTANTS = environment;
