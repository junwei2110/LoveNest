/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Parse from "parse/react-native.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { credentials, serverUrl } from './src/models/enum';
import { BaseIcon } from './src/common/icons/BaseIcon';
import { HomePage } from './src/components/HomePage';
import { Stories } from './src/components/Stories';
import { MediaSearch } from './src/components/MediaSearch';
import { DatePlanner } from './src/components/DatePlanner';
import { UserProfile } from './src/components/UserProfile';
import { UserIcon } from './src/components/UserProfile/Icon';
import { LoginPage } from "./src/components/Login";
import { SignUpPage } from "./src/components/SignUp";
import { Loader } from "./src/common/Loader/Loader";

import { Store } from './src/data';
import { userLogin } from './src/data/actions';

import { LoginStackParamList, UserStackParamList, UserOverallStackParamList } from './types';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(credentials.APP_ID, credentials.JS_KEY);
Parse.serverURL = serverUrl.back4app;


const TabLogin = createNativeStackNavigator<LoginStackParamList>();
const TabUserOverall = createNativeStackNavigator<UserOverallStackParamList>();
const TabUser = createBottomTabNavigator<UserStackParamList>();

const App = () => {
  console.log("App initialized");
  const [globalState, dispatch] = useContext(Store)
  const {currentUser, loading} = globalState;
  
  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await Parse.User.currentAsync();
      dispatch(userLogin(user));
    }
    
    getCurrentUser();
      
  }, []);


  if (loading) {
    return <Loader />
  };

  return (
    <>
    <NavigationContainer>
      {currentUser ? (
        <TabUserOverall.Navigator
          screenOptions={({navigation}) => ({
            headerRight: () => (<UserIcon directToProfile={() => {navigation.navigate('UserProfile')}} />),
          })}>
          <TabUserOverall.Screen name="UserApp" component={UserApp} />
          <TabUserOverall.Screen name="UserProfile" component={UserProfile} />
        </TabUserOverall.Navigator>
        ) : (
        <TabLogin.Navigator>
          <TabLogin.Screen name="Login" component={LoginPage} />
          <TabLogin.Screen name="SignUp" component={SignUpPage} />
          <TabLogin.Screen name="ResetPassword" component={LoginPage} />
        </TabLogin.Navigator>
      )}
    </NavigationContainer>
    </>
  );
};


const UserApp = () => (

  <TabUser.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: () => {
        if (route.name === "Home") {
          return <BaseIcon source={require("./assets/BaseApp/home.png")} />

        } else if (route.name === "Stories") {
          return <BaseIcon source={require("./assets/BaseApp/script.png")} />

        } else if (route.name === "MediaSearch") {
          return <BaseIcon source={require("./assets/BaseApp/find.png")} />

        } else if (route.name === "DatePlanner") {
          return <BaseIcon source={require("./assets/BaseApp/couple.png")} />

        } else if (route.name === "Upload") {
          return <BaseIcon source={require("./assets/BaseApp/more.png")} /> 
        }

      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      headerShown: false
    })}>
    <TabUser.Screen name="Home" component={HomePage} />
    <TabUser.Screen name="Stories" component={Stories} />
    <TabUser.Screen name="MediaSearch" component={MediaSearch} />
    <TabUser.Screen name="DatePlanner" component={DatePlanner} />
  </TabUser.Navigator>

);

export default App;
