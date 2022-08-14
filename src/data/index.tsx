import React, { createContext } from "react";
import { IState, Action } from './types';

export const initialState: IState = {
    currentUser: null,
    loading: true,
    reminderArray: null
}

export const Store = createContext<[IState, React.Dispatch<Action>]>([{} as IState, () => {}]);


