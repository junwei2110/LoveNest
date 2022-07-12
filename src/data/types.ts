import React from "react";
import { action_types } from './actions/enum';

export interface IState {
    currentUser: Parse.Attributes|null;
    loading: boolean;
};
  
export type Action = LoginAction | LogoutAction; //Add more actions here

export type LoginAction = {
    type: action_types.USER_LOGIN;
    payload: Parse.Attributes|null;
};

export type LogoutAction = {
    type: action_types.USER_LOGOUT;
};

