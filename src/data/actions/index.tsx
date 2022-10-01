import { User } from '../../../types';
import { GlobalReminderObj } from '../../components/HomePage/EventModal';
import { Action } from '../types';
import { action_types } from './enum'

export const userLoggingInit = (): Action => ({
    type: action_types.USER_LOGGING_INIT,
});

export const userLoggingEnd = (): Action => ({
    type: action_types.USER_LOGGING_END,
});

export const userLogin = (currentUser: User): Action => ({
    type: action_types.USER_LOGIN,
    payload: currentUser
});

export const userLogout = (): Action => ({
    type: action_types.USER_LOGOUT
});

export const userLoginFailure = (): Action => ({
    type: action_types.USER_LOGIN_FAIL,
});

export const retrieveReminders = (array: GlobalReminderObj[]): Action => ({
    type: action_types.RETRIEVE_REMINDERS,
    payload: array
});

export const updateReminders = (array: GlobalReminderObj[]): Action => ({
    type: action_types.UPDATE_REMINDERS,
    payload: array
});
