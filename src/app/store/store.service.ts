import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthState, initialAuthState } from './auth/auth.state';
import { authReducer } from './auth/auth.reducer';
import { AuthAction } from './auth/auth.actions';

export interface AppState {
  auth: AuthState;
}

const initialAppState: AppState = {
  auth: initialAuthState
};

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private state$ = new BehaviorSubject<AppState>(initialAppState);

  getState(): Observable<AppState> {
    return this.state$.asObservable();
  }

  getCurrentState(): AppState {
    return this.state$.value;
  }

  dispatch(action: AuthAction): void {
    const currentState = this.getCurrentState();
    const newState: AppState = {
      ...currentState,
      auth: authReducer(currentState.auth, action)
    };
    this.state$.next(newState);
  }

  select<T>(selector: (state: AppState) => T): Observable<T> {
    return new Observable(observer => {
      this.state$.subscribe(state => {
        observer.next(selector(state));
      });
    });
  }
}