import React from 'react';
import { Text, Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCameraDevices, Camera } from 'react-native-vision-camera';

import { CalendarView } from './Calendar';
import { ImageAnimation } from './ImageAnimation';



export const HomePage = () => {

    const navigation = useNavigation();
    const devices = useCameraDevices();
    const device = devices.front;

    return (
        <View style={{
            height: "100%",
            backgroundColor: "#fad9c1"
        }}>
            <ImageAnimation />
            <CalendarView />
            {/*TODO: Add some Promotional Package*/}
        </View>
    )
}