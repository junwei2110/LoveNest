import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { Alert, Button, Text } from 'react-native';
import { configurePushNotifications } from '.';

// PushNotification.createChannel({
//     channelId: "guideChannel",
//     channelName: "Guide channel"
// }, () => { console.log("Channel Created") })


// export const NotificationController = () => {
    
//     useEffect(() => {
//         configurePushNotifications();
//         const unsubscribe = messaging().onMessage(async (remoteMessage) => {
//             PushNotification.localNotification({
//                 message: remoteMessage?.notification?.body || "",
//                 title: remoteMessage?.notification?.title,
//             })
//         })

//         return unsubscribe();
//     }, [])

//     const checkToken = async () => {
//         const fcmtoken = await messaging().getToken();
//         if (fcmtoken) {
//             Alert.alert(fcmtoken);
//             console.log(fcmtoken);
//         }
//     }

//     return (
//         <Button title={"Check Token"} onPress={checkToken} />
//     );
// }

export class LocalNotif {



}