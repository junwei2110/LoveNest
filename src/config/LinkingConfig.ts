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

            const regexRefreshTrue = /.*\?refresh=true$/;

            const {linking = null} = notification?.data || {};
            let linkUrl = linking;

            if (linking && linking.match(regexRefreshTrue)) {
                const urlArr = linking.split("?");
                linkUrl = urlArr[0];

            }

            linkUrl && Linking.openURL(linkUrl); 
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