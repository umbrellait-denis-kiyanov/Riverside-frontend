declare global {
  interface Window {
    toastr: any;
  }
}
const toastr = window.toastr;

export default toastr;
