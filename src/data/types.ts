import React from "react";
import { GlobalReminderObj } from "../components/HomePage/EventModal";
import { action_types } from './actions/enum';

export interface IState {
    currentUser: Parse.Attributes|null;
    loading: boolean;
    reminderArray: GlobalReminderObj[]|null;
};
  
export type Action = 
    LoggingAction | LoggingActionEnd | LoginAction | LoginActionFail | LogoutAction | RetrieveReminders | UpdateReminders; //Add more actions here

export type LoggingAction = {
    type: action_types.USER_LOGGING_INIT;
};

export type LoggingActionEnd = {
    type: action_types.USER_LOGGING_END;
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

export type RetrieveReminders = {
    type: action_types.RETRIEVE_REMINDERS;
    payload: GlobalReminderObj[];

};

export type UpdateReminders = {
    type: action_types.UPDATE_REMINDERS;
    payload: GlobalReminderObj[];

};

