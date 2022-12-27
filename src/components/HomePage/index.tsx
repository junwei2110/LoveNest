import React, { useEffect } from 'react';
import { Text, Button, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import { CalendarDateView } from "./CalendarDates";
import { CalendarView } from './CalendarEvents';

type HomeRouteProp = {
    Home: {
        refresh?: string;

    }
}

export const HomePage = ({getCurrentUser} : {
    getCurrentUser: () => void;
}) => {

    //To get the refresh param, push notification is "linking": "lovenest://home?refresh=true"
    const route = useRoute<RouteProp<HomeRouteProp>>();    
    const refresh = route.params?.refresh;
    useEffect(() => {
        if (refresh === "true") {
            getCurrentUser();
        }
    }, [refresh]);

    return (
        <View style={{
            height: "100%",
        }}>
            <CalendarDateView />
            <CalendarView />
            {/*TODO: Add some Promotional Package*/}
        </View>
    )
}