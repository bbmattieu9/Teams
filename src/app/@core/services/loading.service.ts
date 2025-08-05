import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngxs/store';
import { Base } from '../state/base.actions';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private counter = 0;
  private _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  constructor(private store: Store) {}

  loadingOn(): void {
    this.counter++;
    if (this.counter === 1) {
      this._loading$.next(true);
     
      this.store.dispatch(new Base.SetIsLoading(true));
    }
  }

  loadingOff(): void {
    if (this.counter <= 0) return;
    this.counter--;
    if (this.counter === 0) {
      this._loading$.next(false);
      this.store.dispatch(new Base.SetIsLoading(false));
    }
  }

  reset(): void {
    this.counter = 0;
    this._loading$.next(false);
    this.store.dispatch(new Base.SetIsLoading(false));
  }
}
