import { Linking } from 'react-native';
import PushNotification from 'react-native-push-notification';


const config = {
    screens: {
        UserApp: {
            screens: {
                Home: {
                    exact: true,
                    path: "home",
                },
                Stories: {
                    exact: true,
                    path: "stories"
                },
                MediaSearch: {
                    exact: true,
                    path: "mediasearch"
                },
                DatePlanner: {
                    exact: true,
                    path: "dateplanner"
                },
            }
        },
        UserProfile: "userprofile"
    }
}


export const linking = {
    prefixes: ["lovenest://"],
    config,
    getInitialURL: async () => {
        PushNotification.popInitialNotification(notification => {
            if (!notification) return;
      
            const {linking = null} = notification?.data || {};
            linking && Linking.openURL(linking); 
          });
      
          // this is the default return
          return Linking.getInitialURL();
    },
    subscribe: (listener: (url: string) => void) => {
        const onReceiveURL = ({url}: {url: string}) => listener(url);
        const subscription = Linking.addEventListener("url", onReceiveURL);

        return () => subscription.remove();
    }
}