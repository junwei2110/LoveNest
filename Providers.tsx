import React, { useReducer } from 'react';
import Parse from "parse/react-native.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { credentials, serverUrl } from './src/models/enum';

import App from "./App";
import { Store, initialState } from './src/data';
import { reducer } from './src/data/reducers';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(credentials.APP_ID, credentials.JS_KEY);
Parse.serverURL = serverUrl.back4app;


const Providers = () => {

  const [globalState, dispatch] = useReducer(reducer, initialState);
  //TODO: Create a global loading overlay
  return (
    <>
      <Store.Provider value={[globalState, dispatch]}>
          <App />
      </Store.Provider>
    </>
  );
};


export default Providers;
