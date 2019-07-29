import { BehaviorSubject } from 'rxjs';

export class ResourceFromServer<T> {
  data: T;
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  saving: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  error: string = '';

  load(loadPromise: Promise<any>) {
    return this._request(loadPromise, 'loading').then(async (res: any) => {
      this.data = res;
      !!this.data && this.ready.next(true);
      return res;
    });
  }

  save(loadPromise: Promise<any>) {
    return this._request(loadPromise, 'saving');
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
        this[loadKey].next(true);
      });
  }
}
