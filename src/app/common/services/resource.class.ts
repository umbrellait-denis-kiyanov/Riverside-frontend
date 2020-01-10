import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

const resourceOptions = {
  saveMessage: null
};

export class ResourceFromServer<T> {
  data: T;
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  saving: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  error: string = '';
  change: BehaviorSubject<number> = new BehaviorSubject<number> (0);
  options: Partial<typeof resourceOptions>;

  constructor(public toastr: ToastrService, options: Partial<typeof resourceOptions> = {}) {
    this.options = {...resourceOptions, ...options};
    // this.toastr = new ToastrService();
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
      const {saveMessage: msg} = this.options;
      if (msg) {
        this.toastr.success(msg);
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
