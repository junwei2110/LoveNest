import {AppRegistry} from 'react-native';
import messaging from "@react-native-firebase/messaging";

import Providers from './Providers';
import {name as appName} from './app.json';
import { configurePushNotifications, localNotification } from "./src/services/PushNotifications";



//Configure push notifs for first time downloads
configurePushNotifications();
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("remoteMessage in background", remoteMessage);
  localNotification(remoteMessage)

});
/* 
  From killed state, automatic reload
  From foreground/background state, need to trigger app to reload
*/
console.log("refreshing app")
AppRegistry.registerComponent(appName, () => Providers);
