import { IState, Action } from '../types';
import { action_types } from '../actions/enum';


export const reducer = (state: IState, action: Action): IState => {
    switch (action.type) {
      case action_types.USER_LOGIN:
        const {payload} = action;
        return {
          ...state,
          currentUser: payload,
          loading: false,
        }
      case action_types.USER_LOGOUT:
        return {
          ...state,
          currentUser: null,
        }
      default:
        return state;
    }
  };