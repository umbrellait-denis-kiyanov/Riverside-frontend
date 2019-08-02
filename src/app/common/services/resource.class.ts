import { BehaviorSubject } from 'rxjs';

const resourceOptions = {
  saveMessage: null,
  toastrOptions: {timeOut: 1000, positionClass: 'toast-top-right'}
};
export class ResourceFromServer<T> {
  data: T;
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  saving: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  error: string = '';
  change: BehaviorSubject<number> = new BehaviorSubject<number> (0);
  options: Partial<typeof resourceOptions>;

  constructor(options: Partial<typeof resourceOptions> = {}) {
    this.options = {...resourceOptions, ...options};
  }

  load(loadPromise: Promise<any>) {
    return this._request(loadPromise, 'loading').then(async (res: any) => {
      this.data = res;
      !!this.data && this.ready.next(true);
      return res;
    });
  }

  save(loadPromise: Promise<any>) {
    return this._request(loadPromise, 'saving').then(async (res) => {
      const {saveMessage: msg, toastrOptions} = this.options;
      if (msg) {
        window.toastr.success(msg, '', toastrOptions);
      }
    });
  }

  private _request(loadPromise: Promise<any>, loadKey: 'saving' | 'loading') {
    this[loadKey].next(true);
    return loadPromise
      .then(async res => {
        this.error = '';
        return res;
      })
      .catch((e: Error) => {
        this.error = e.message;
      })
      .finally(() => {
        this[loadKey].next(false);
      });
  }
}
