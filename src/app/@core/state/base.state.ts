import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Base } from './base.actions';



export interface BaseStateModel {
  isLoading: boolean;
  errorMessage: string;
  successMessage: string;
  successHeader: string;
}

export const DEFAULT_BASE_STATE: BaseStateModel = {
  isLoading: false,
  errorMessage: '',
  successMessage: '',
  successHeader: ''
};

@State<BaseStateModel>({
  name: 'base',
  defaults: DEFAULT_BASE_STATE,
})
@Injectable()
export class BaseState<T extends BaseStateModel> {
  @Action(Base.SetIsLoading)
  setLoading(ctx: StateContext<BaseStateModel>, actions: Base.SetIsLoading) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      isLoading: actions.isLoading,
    });
  }

  @Action(Base.SetError)
  setError(ctx: StateContext<BaseStateModel>, actions: Base.SetError) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      errorMessage: actions.message,
    });
  }

  @Action(Base.SetSuccess)
  setSuccess(ctx: StateContext<BaseStateModel>, actions: Base.SetSuccess) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      successMessage: actions.message,
      successHeader: actions.successHeader
    });
  }

  protected fetch<R extends Record<string, any>>(
    ctx: StateContext<T>,
    serviceCall: () => Observable<R>,
    successAction: (response: R) => any
  ) {
    // Interceptor + LoadingService drive the global spinner.
    return serviceCall().pipe(
      tap((response) => {
        successAction(response);
      }),
      catchError((err) => {
        if (err?.status !== 401) {
          const errorMessage = err?.error?.Message;
          if (errorMessage) {
            ctx.dispatch(new Base.SetError(errorMessage));
          } else {
            ctx.dispatch(new Base.SetError('Something went wrong'));
          }
        }
        return throwError(() => new Error(err?.message ?? 'Unknown error'));
      })
    );
  }

  protected set<R extends Record<string, any>>(
    ctx: StateContext<T>,
    serviceCall: () => Observable<R>,
    successAction: (response: R) => any,
    successMessage: string,
    showSuccessPopUp = true,
    successHeader = 'Successful'
  ) {
    // Interceptor + LoadingService drive the global spinner.
    return serviceCall().pipe(
      tap((response) => {
        successAction(response);
        if (showSuccessPopUp) ctx.dispatch(new Base.SetSuccess(successMessage, successHeader));
      }),
      catchError((err) => {
        if (err?.status !== 401) {
          const errorMessage = err?.error?.Message;
          if (errorMessage) {
            ctx.dispatch(new Base.SetError(errorMessage));
          } else {
            ctx.dispatch(new Base.SetError('Something went wrong'));
          }
        }
        return throwError(() => new Error(err?.message ?? 'Unknown error'));
      })
    );
  }

  @Selector()
  static isLoading(state: BaseStateModel) {
    return state.isLoading;
  }

  @Selector()
  static errorMessage(state: BaseStateModel) {
    return state.errorMessage;
  }

  @Selector()
  static successMessage(state: BaseStateModel) {
    return state.successMessage;
  }

  @Selector()
  static successHeader(state: BaseStateModel) {
    return state.successHeader;
  }
}
