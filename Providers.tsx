import React, { useReducer } from 'react';

import App from "./App";
import { Store, initialState } from './src/data';
import { reducer } from './src/data/reducers';


const Providers = () => {

  const [globalState, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <Store.Provider value={[globalState, dispatch]}>
          <App />
      </Store.Provider>
    </>
  );
};


export default Providers;
