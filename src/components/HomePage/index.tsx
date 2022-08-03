import React from 'react';
import { Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCameraDevices, Camera } from 'react-native-vision-camera';

import { HomeView } from './styled';


export const HomePage = () => {

    const navigation = useNavigation();
    const devices = useCameraDevices();
    const device = devices.front;

    return (
        <HomeView>
            <Text>Home</Text>
        </HomeView>
    )
}