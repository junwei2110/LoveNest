import React from "react";
import { action_types } from './actions/enum';

export interface IState {
    currentUser: Parse.Attributes|null;
    loading: boolean;
};
  
export type Action = 
    LoggingAction | LoginAction | LoginActionFail | LogoutAction; //Add more actions here

export type LoggingAction = {
    type: action_types.USER_LOGGING_INIT;
};

export type LoginAction = {
    type: action_types.USER_LOGIN;
    payload: Parse.Attributes|null;
};

export type LoginActionFail = {
    type: action_types.USER_LOGIN_FAIL;
};

export type LogoutAction = {
    type: action_types.USER_LOGOUT;
};

