import React, { useEffect, useState } from 'react';
import Parse from "parse/react-native.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { credentials, serverUrl } from './src/models/enum';
import App from "./App";
import { LoginPage } from "./src/components/Login";
import { Loader } from "./src/common/Loader/Loader";


Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(credentials.APP_ID, credentials.JS_KEY);
Parse.serverURL = serverUrl.back4app;


const Providers = () => {

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Parse.Attributes|null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const currentUser = await Parse.User.currentAsync();
      if (currentUser) {
        setCurrentUser(currentUser);
      };
      setLoading(false);
    };
    
    getCurrentUser();
      
  }, [currentUser, loading]);

  return (
    <>
      {loading && <Loader />} 
      {!loading && currentUser && <App />}
    </>
  );
};


export default Providers;
