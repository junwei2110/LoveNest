import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInputProps, TextProps } from 'react-native';
import AddPhoto from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, CameraDevice, useCameraDevices } from 'react-native-vision-camera';
import * as ImagePicker from "react-native-image-picker"

import { SearchBar } from '../../common/SearchBar';
import { IconFromNative } from '../../common/icons/IconFromNative';
import { SetUpStackParamList } from '../PhotoModal/PhotoModal';
import { ImageView } from './ImageView';
import { MediaOptions } from '../UserProfile';

export const MediaSearch = () => {

    const [camPermStatus, setCamPermStatus] = useState(false);
    const devices = useCameraDevices();
    const navigation = useNavigation<NativeStackNavigationProp<SetUpStackParamList>>();


    useEffect(() => {
        const checkCameraPermission = async () => {
            const status = await Camera.getCameraPermissionStatus();
            setCamPermStatus(status === "authorized");
        }

        checkCameraPermission();

    })

    const onCamHandle = () => {
        if (camPermStatus) {
            navigation.navigate("PhotoModal", {
                devices: devices as Record<string, CameraDevice>
            })

        } else {
            Alert.alert("Camera not permissible for use")
        }
        
    }

    const handleChoosePhoto = () => {
        const options: MediaOptions = {
            mediaType: "photo",
            includeBase64: true,
          };
        ImagePicker.launchImageLibrary(options, async (response) => {
            if (response.uri) {
                try {
                    navigation.navigate("PhotoTaken", {
                        activeUri: response.uri  
                    })
                    
                } catch {
                    Alert.alert("Picture failed to resolve. Please try again");
                }
            }
        });

    };


    return (
        <View style={{
            height: "100%",
            backgroundColor: "#fad9c1",
            paddingTop: 10
        }}>

            <ImageView />
            <IconFromNative
            style={style.iconCamStyle as TextProps}
            onClick={onCamHandle} 
            children={
                <>
                    <AddPhoto name={"add-a-photo"} size={50} />
                </>
            } />
            <IconFromNative 
            style={style.iconFileStyle as TextProps}
            onClick={handleChoosePhoto}
            children={
                <>
                <AddPhoto name={"add-photo-alternate"} size={50} color={"#fe9c8f"} />
                </>
            } />
        </View>
    )
}






const style = {
    searchBar: {
        borderWidth: 1,
        borderRadius: 50,
        marginHorizontal: 10,
        marginVertical: 10,
        paddingLeft: 20
    },
    iconCamStyle: {
        position: "absolute",
        bottom: "5%",
        left: "15%",
        borderWidth: 1,
        borderRadius: 50,
        padding: 15

    },
    iconFileStyle: {
        position: "absolute",
        bottom: "5%",
        right: "15%",
        borderWidth: 1,
        borderRadius: 50,
        padding: 15

    }
}