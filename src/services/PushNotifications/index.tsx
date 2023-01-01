import PushNotification from 'react-native-push-notification';
import Parse from 'parse/react-native';
import uuid from 'react-native-uuid';
import messaging from "@react-native-firebase/messaging";
import {APP_NAME, GCM_SENDER_ID, PACKAGE_NAME} from 'react-native-dotenv';

import { Linking } from 'react-native';

const channelId: string = 'general';

const configurePushNotifications = async () => {
  // Initialize PushNotification
  await PushNotification.configure({
    onRegister: async function (token: {os: string; token: string}) {
      let deviceToken: string = token.token;

      // Create a Parse Installation, that will link our application's push notification
      // to the Parse server
      try {
        const request = {
          deviceToken,
          channelId,
          GCM_SENDER_ID,
          APP_NAME,
          PACKAGE_NAME,
          installationId: uuid.v4(),
        }

        const installationObj = await Parse.Cloud.run("firstDeviceInstallation", request)

        if (!installationObj) {
          console.log("New Device detected!")
          // Create the notification channel, required for Android notifications
          await PushNotification.createChannel({
            channelId: channelId,
            channelName: 'general',
          }, (created) => {
            console.log(`createChannel 'default-channel-id' returned '${created}'`)
          });
        }
      } catch (error: any) {
        console.log(error.message);
      }
    },
    onNotification: async (notification) => {
      if (notification?.data?.linking) {
        const link = notification.data.linking;
        let user = await Parse.User.currentAsync();
        if (user) {
          const validUrl = await Linking.canOpenURL(link) 
          validUrl && Linking.openURL(link);
        } 
        
      }
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
  return PushNotification;
}


const localNotification = (notification: Record<string, any>) => {
  if (
      notification.data !== undefined &&
      notification.data.data !== undefined
    ) {
      try {
        // Notification data comes as a stringified JSON, so parsing is needed
        const notificationData = JSON.parse(notification.data.data);
        // JSON Parse notifications from the dashboard and Cloud Code
        // should contain the default `title` and `message` parameters
        let title: string = 'Hey there!';
        if (notificationData.title !== undefined) {
          title = notificationData.title;
        }
        let message: string = 'Your details have been updated!';
        if (notificationData.message !== undefined) {
          message = notificationData.message;
        }
        // Text Parse notifications from the dashboard only have an `alert` parameter
        if (notificationData.alert !== undefined) {
          message = notificationData.alert;
        }
        let channelIdToUse: string = channelId;
        if (notificationData.channelId !== undefined) {
          channelIdToUse = notificationData.channelId;
        }
        PushNotification.createChannel({
          channelId: channelIdToUse,
          channelName: channelIdToUse,
        }, () => {})
        PushNotification.localNotification({
          channelId: channelIdToUse,
          title: title,
          message: message,
          userInfo: {
            linking: notificationData?.linking
          }
        });

      } catch (error: any) {
        console.log(`Error triggering local notification ${error}`);
      }
    }

}

//Basically Channels are created only once, until you un-install and re-install the Application.
const updatePushChannel = async (newChannelId: string) => {

  await PushNotification.createChannel({
    channelId: newChannelId,
    channelName: newChannelId,
  }, (created) => {
    console.log(`create New Channel ${newChannelId} returned '${created}'`)
  });

  const deviceToken = await messaging().getToken();

  try {
    const query = new Parse.Query(Parse.Installation);
    query.equalTo("deviceToken", deviceToken);
    const installationObj = await query.first();

    const currentChannels = installationObj?.get('channels');
    
    if (installationObj && currentChannels && currentChannels.length) {
      installationObj.set('channels', [...currentChannels, newChannelId]);
      await installationObj.save();
      console.log("Updated channels for Parse Installation");
    }
  
  } catch (error: any) {
    console.log(error.message);
  }

}


export {configurePushNotifications, localNotification}



