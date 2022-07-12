import React, { createContext } from "react";
import { IState, Action } from './types';

export const initialState: IState = {
    currentUser: null,
    loading: true
}

export const Store = createContext<[IState, React.Dispatch<Action>]>([{} as IState, () => {}]);


