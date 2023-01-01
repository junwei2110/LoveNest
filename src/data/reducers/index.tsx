import { IState, Action } from '../types';
import { action_types } from '../actions/enum';


export const reducer = (state: IState, action: Action): IState => {
    switch (action.type) {
      case action_types.USER_LOGGING_INIT:
        return {
          ...state,
          loading: true,
        }
      case action_types.USER_LOGGING_END:
          return {
            ...state,
            loading: false,
          }
      case action_types.USER_LOGIN:
        return {
          ...state,
          currentUser: action.payload,
          loading: false,
        }
      case action_types.USER_LOGIN_FAIL:
        return {
          ...state,
          loading: false,
        }
      case action_types.USER_LOGOUT:
        return {
          ...state,
          currentUser: null,
          loading: false,
        }
      case action_types.RETRIEVE_REMINDERS:
        return {
          ...state,
          reminderArray: action.payload
        }
      case action_types.UPDATE_REMINDERS:
        return {
          ...state,
          reminderArray: action.payload
        }
      case action_types.FILTER_REMINDERS:
        return {
          ...state,
          filteredArray: action.payload,
          useFilteredArray: true
        }
      case action_types.CLEAR_FILTER_REMINDERS:
        return {
          ...state,
          filteredArray: null,
          useFilteredArray: false
        }
      default:
        return state;
    }
  };