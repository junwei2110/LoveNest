/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { BaseIcon } from './src/common/icons/BaseIcon';
import { HomePage } from './src/components/HomePage';
import { Stories } from './src/components/Stories';
import { MediaSearch } from './src/components/MediaSearch';
import { DatePlanner } from './src/components/DatePlanner';


const Tab = createBottomTabNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
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
          tabBarInactiveTintColor: 'gray'
        })}>
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Stories" component={Stories} />
        <Tab.Screen name="MediaSearch" component={MediaSearch} />
        <Tab.Screen name="DatePlanner" component={DatePlanner} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};


export default App;
