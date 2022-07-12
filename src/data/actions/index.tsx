import { User } from '../../../types';
import { Action } from '../types';
import { action_types } from './enum'

export const userLogin = (currentUser: User): Action => ({
    type: action_types.USER_LOGIN,
    payload: currentUser
});

export const userLogout = (): Action => ({
    type: action_types.USER_LOGOUT
});