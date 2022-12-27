import React, { useEffect, useContext, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import Parse from "parse/react-native.js";
import { Camera } from 'react-native-vision-camera';
import { Alert, Image, Modal, Text, TextProps, TouchableOpacity, View } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import messaging from "@react-native-firebase/messaging";

import { HomePage } from './src/components/HomePage';
import { Stories } from './src/components/Stories';
import { MediaSearch } from './src/components/MediaSearch';
import { DatePlanner } from './src/components/DatePlanner';
import { UserProfile } from './src/components/UserProfile';
import { PhotoModal } from './src/components/PhotoModal/PhotoModal';
import { PhotoTaken } from './src/components/PhotoModal/PhotoTaken';
import { SetUpProfileTabs } from './src/components/UserProfile/SetUpTabs';
import { UserIcon } from './src/components/UserProfile/Icon';
import { LoginPage } from "./src/components/Login";
import { PasswordReset } from "./src/components/Login/PasswordReset";
import { SignUpPage } from "./src/components/SignUp";
import { Store } from './src/data';
import { userLoggingEnd, userLoggingInit, userLogin } from './src/data/actions';
import { localNotification } from "./src/services/PushNotifications"
import { linking } from './src/config/LinkingConfig';

import { LoginStackParamList, UserStackParamList, UserOverallStackParamList, OverallParamList } from './types';


const TabLogin = createNativeStackNavigator<LoginStackParamList>();
const TabUserOverall = createNativeStackNavigator<UserOverallStackParamList>();
const TabUser = createMaterialBottomTabNavigator<UserStackParamList>();

const App = () => {
  console.log("App initialized");
  const [globalState, dispatch] = useContext(Store)
  const { currentUser } = globalState;

  const [initLoading, setInitLoading] = useState(true);
  
  useEffect(() => {

    const checkCameraPermission = async () => {
      let status = await Camera.getCameraPermissionStatus();
      if (status !== 'authorized') {
        await Camera.requestCameraPermission();
        status = await Camera.getCameraPermissionStatus();
        if (status === 'denied') {
          Alert.alert(
            'You will not be able to take pictures within this app',
          );
        }
      }
    };
    
    getCurrentUser();
    checkCameraPermission();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("onMessage", remoteMessage)
      localNotification(remoteMessage)

    })

    return () => unsubscribe()
      
  }, []);

  const getCurrentUser = async () => {
    try {
      setInitLoading(true);
      dispatch(userLoggingInit());
      let user = await Parse.User.currentAsync();
      user = await user?.fetch() || null;
      dispatch(userLogin(user));
      setInitLoading(false);
    } catch(e) {
      dispatch(userLoggingEnd());
      setInitLoading(false);
      Alert.alert("Failed to retrieve user credentials. Please try again");
    }
    
  };

  return (
    <>
    {!initLoading ?
    <NavigationContainer linking={linking as LinkingOptions<OverallParamList>}>
      {currentUser ? (
        <>
          <ModalForPartner
            userId={currentUser.id}
            partnerId={currentUser.get("pendingPartnerDetails")?.["partnerId"]}
            partnerEmail={currentUser.get("pendingPartnerDetails")?.["partnerEmail"]}
            partnerPic={currentUser.get("pendingPartnerDetails")?.["partnerPic"]}
            />
        <TabUserOverall.Navigator
          screenOptions={({navigation}) => ({
            headerRight: () => (<UserIcon directToProfile={() => {navigation.navigate('UserProfile')}} />),
            title: `Welcome ${currentUser.get("avatarName") || ""}`,
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTitleStyle: {
              fontWeight: 'normal',
            },
          })}>
          <TabUserOverall.Screen name="UserApp">
            {() => <UserApp {...{getCurrentUser}} />}
          </TabUserOverall.Screen>
          <TabUserOverall.Screen name="UserProfile" component={UserProfile} />
          <TabUserOverall.Screen name="SetUpProfile" component={SetUpProfileTabs} 
          options={{ 
            presentation: 'modal', 
            headerShown: false}}/>
          <TabUserOverall.Screen name="PhotoModal" component={PhotoModal} 
          options={{ 
            presentation: 'modal', 
            headerShown: false}}/>
          <TabUserOverall.Screen name="PhotoTaken" component={PhotoTaken} 
          options={{ 
            presentation: 'modal', 
            headerShown: false}}/>
        </TabUserOverall.Navigator>
        </>
        ) : (
        <TabLogin.Navigator>
          <TabLogin.Screen name="Login" component={LoginPage} />
          <TabLogin.Screen name="SignUp" component={SignUpPage} />
          <TabLogin.Screen name="ResetPassword" component={PasswordReset} />
        </TabLogin.Navigator>
      )}
    </NavigationContainer>
    : null}
    </>
  );
};


const UserApp = ({getCurrentUser}: {
  getCurrentUser: () => void;
}) => (

  <TabUser.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: () => {
        if (route.name === "Home") {
          return <AntIcon name="home" size={22} color="white" />

        } else if (route.name === "Stories") {
          return <AntIcon name="wechat" size={22} color="white" />

        } else if (route.name === "MediaSearch") {
          return <MaterialIcon name="photo-camera-front" size={22} color="white" />

        } else if (route.name === "DatePlanner") {
          return <Fontisto name="holiday-village" size={22} color="white" />

        }
      }
    })}>
    <TabUser.Screen 
      name="Home" 
      options={{
        tabBarColor: "#f0516f" 
      }}  
    >
      {() => <HomePage {...{getCurrentUser}} />}
    </TabUser.Screen>
    <TabUser.Screen name="Stories" component={Stories} 
    options={{
      tabBarColor: "#03045e" 
    }}  />
    <TabUser.Screen name="MediaSearch" component={MediaSearch} 
    options={{
      tabBarColor: "#ff5003" 
    }}
    />
    <TabUser.Screen name="DatePlanner" component={DatePlanner} 
    options={{
      tabBarColor: "#00b761" 
    }}
    />
  </TabUser.Navigator>

);


const ModalForPartner = (props : {
  userId: string | undefined;
  partnerId: string | undefined;
  partnerEmail: string | undefined;
  partnerPic: string | undefined;
}) => {
  
  const [visible, setVisible] = useState(!!props.partnerId);
  const dummyProfilePic = require("./assets/BaseApp/account.png");
  const dummyProfilePicUri = Image.resolveAssetSource(dummyProfilePic).uri;


  const handlePartner = async (keyword: "Accept"|"Reject") => {
    try {
      await Parse.Cloud.run(`partner${keyword}`, {
        userId: props.userId,
        partnerId: props.partnerId
      });
      Toast.show({
        type: "success",
        text1: `Partner ${keyword}ed!`
      })
      setVisible(false);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error, please try again!"
      })
      setVisible(false);
    }
  }


  return (
    <Modal
      visible={visible}
    >
      <View style={{alignItems: "center", justifyContent: "center", width: "100%", height: "100%", borderWidth: 1}}>
      <View style={{flex: 1, maxHeight: "15%", width: "20%"}}>
        <FastImage
          source={{ uri: props.partnerPic || dummyProfilePicUri }}
          resizeMode={"contain"}
          style={{flex: 1, width: undefined, height: undefined}}  
        />
      </View>
      <Text style={{textAlign: "center"}}>{props.partnerEmail} wants to connect with you</Text>
      <View style={{display: "flex", flexDirection: "row", position: "absolute", bottom: "20%", width: "100%", justifyContent: "space-around"}}>
        <TouchableOpacity
          style={{borderWidth: 1, padding: 15, borderRadius: 25, backgroundColor: "#00b761", width: "40%"}}
          onPress={() => handlePartner("Accept")}>
              <Text style={{textAlign: "center", color: "white"}}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{borderWidth: 1, padding: 15, borderRadius: 25, backgroundColor: "#ff5003", width: "40%"}}
          onPress={() => handlePartner("Reject")}>
              <Text style={{textAlign: "center", color: "white"}}>Reject</Text>
        </TouchableOpacity>
      </View>
      </View>

    </Modal>
  )
}



export default App;
