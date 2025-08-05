import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { Store } from '@ngxs/store';
// import { Base } from '../actions/base.actions';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private counter = 0;
  private _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

//   constructor(private store: Store) {}

  loadingOn(): void {
    this.counter++;
    if (this.counter === 1) {
      this._loading$.next(true);
      // Keep NGXS in sync — useful if other parts of app still read BaseState.isLoading
    //   this.store.dispatch(new Base.SetIsLoading(true));
    }
  }

  loadingOff(): void {
    if (this.counter <= 0) return;
    this.counter--;
    if (this.counter === 0) {
      this._loading$.next(false);
    //   this.store.dispatch(new Base.SetIsLoading(false));
    }
  }

  // Useful for error recovery or test cleanup
  reset(): void {
    this.counter = 0;
    this._loading$.next(false);
    // this.store.dispatch(new Base.SetIsLoading(false));
  }
}
