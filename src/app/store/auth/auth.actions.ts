import { User } from '../../core/models/user.model';

export interface AuthAction {
  type: string;
  payload?: any;
}

export const AuthActionTypes = {
  LOGIN: '[Auth] Login',
  LOGIN_SUCCESS: '[Auth] Login Success',
  LOGIN_FAILURE: '[Auth] Login Failure',
  LOGOUT: '[Auth] Logout',
  LOAD_USER_FROM_STORAGE: '[Auth] Load User From Storage'
};

export const login = (email: string, password: string): AuthAction => ({
  type: AuthActionTypes.LOGIN,
  payload: { email, password }
});

export const loginSuccess = (user: User, token: string): AuthAction => ({
  type: AuthActionTypes.LOGIN_SUCCESS,
  payload: { user, token }
});

export const loginFailure = (error: string): AuthAction => ({
  type: AuthActionTypes.LOGIN_FAILURE,
  payload: { error }
});

export const logout = (): AuthAction => ({
  type: AuthActionTypes.LOGOUT
});

export const loadUserFromStorage = (): AuthAction => ({
  type: AuthActionTypes.LOAD_USER_FROM_STORAGE
});