import React from 'react';
import { Text, Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCameraDevices, Camera } from 'react-native-vision-camera';

import { CalendarView } from './Calendar';



export const HomePage = () => {

    const navigation = useNavigation();
    const devices = useCameraDevices();
    const device = devices.front;

    return (
        <>
            <CalendarView />
        </>
    )
}