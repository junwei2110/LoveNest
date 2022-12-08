import PushNotification from 'react-native-push-notification';
import Parse from 'parse/react-native';
import uuid from 'react-native-uuid';


import {APP_NAME, GCM_SENDER_ID, PACKAGE_NAME} from 'react-native-dotenv';

const channelId: string = 'guideChannel';

export async function configurePushNotifications() {
  // Initialize PushNotification
  await PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification: Record<string, any>) {
      // process the notification
      console.log('NOTIFICATION:', notification);
      // If notification is remote and has data, trigger local notification to show popup.
      // This is needed for Parse sent notifications because Firebase doesn't trigger popup
      // notifications with data by itself
      if (
        notification.data !== undefined &&
        notification.data.data !== undefined
      ) {
        try {
          // Notification data comes as a stringified JSON, so parsing is needed
          const notificationData = JSON.parse(notification.data.data);
          // JSON Parse notifications from the dashboard and Cloud Code
          // should contain the default `title` and `message` parameters
          let title: string = 'Notification Title';
          if (notificationData.title !== undefined) {
            title = notificationData.title;
          }
          let message: string = 'Noticiation Message';
          if (notificationData.message !== undefined) {
            message = notificationData.message;
          }
          // Text Parse notifications from the dashboard only have an `alert` parameter
          if (notificationData.alert !== undefined) {
            message = notificationData.alert;
          }
          PushNotification.localNotification({
            channelId: channelId,
            title: title,
            message: message,
          });
        } catch (error: any) {
          console.log(`Error triggering local notification ${error}`);
        }
      }
    },

    onRegister: async function (token: {os: string; token: string}) {
      console.log(`Registered with device token ${token.token}`);
      let deviceToken: string = token.token;

      // Create the notification channel, required for Android notifications
      await PushNotification.createChannel({
        channelId: channelId,
        channelName: 'Guide channel',
      }, () => {console.log('Notification channel created!');});
      

      // Create a Parse Installation, that will link our application's push notification
      // to the Parse server
      try {
        const Installation = new Parse.Installation();
       
        // Make sure to change any needed value from the following
        Installation.set('deviceType', 'android');
        Installation.set('GCMSenderId', GCM_SENDER_ID);
        Installation.set('pushType', 'gcm');
        Installation.set('appIdentifier', PACKAGE_NAME);
        Installation.set('parseVersion', '3.2.0');
        Installation.set('appName', APP_NAME);
        Installation.set('appVersion', '1.0');
        Installation.set('localeIdentifier', 'pt-BR');
        Installation.set('badge', 0); // Set initial notification badge number
        Installation.set('timeZone', 'America/Sao_Paulo');
        Installation.set('installationId', uuid.v4());
        Installation.set('channels', [channelId]);
        Installation.set('deviceToken', deviceToken);
        await Installation.save();
        console.log(`Created new Parse Installation ${Installation}`);
      } catch (error: any) {
        console.log(error.message);
      }
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
}



