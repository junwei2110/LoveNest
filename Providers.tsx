import React, { useReducer } from 'react';
import Parse from "parse/react-native.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_ID, JS_KEY, SERVER_URL_BACK4APP} from 'react-native-dotenv';
import Toast from 'react-native-toast-message';

import App from "./App";
import { Store, initialState } from './src/data';
import { reducer } from './src/data/reducers';
import { GlobalLoader } from './src/components/GlobalLoader';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = SERVER_URL_BACK4APP;

console.log("hello", SERVER_URL_BACK4APP);
const Providers = () => {

  const [globalState, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <Store.Provider value={[globalState, dispatch]}>
          <GlobalLoader />
          <App />
          <Toast />
      </Store.Provider>
    </>
  );
};


export default Providers;
