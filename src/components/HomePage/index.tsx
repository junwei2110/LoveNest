import React from 'react';
import { Text, Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCameraDevices, Camera } from 'react-native-vision-camera';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

import { CalendarDateView } from "./CalendarDates";
import { CalendarView } from './CalendarEvents';
import { ImageAnimation } from './ImageAnimation';



export const HomePage = () => {

    const navigation = useNavigation();
    const devices = useCameraDevices();
    const device = devices.front;

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