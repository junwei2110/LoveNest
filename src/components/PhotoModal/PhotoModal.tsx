import React, { useState, useRef, useContext } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, Modal, Button, Alert } from 'react-native';
import { Camera, CameraDevice } from 'react-native-vision-camera';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { 
    ImageBox,
    ReverseBox,
    CameraButton, 
    CameraBottomView,
    CameraButtonView, 
    CameraView,
    CloseView,
    CloseButton, 
    ProfilePic} from '../UserProfile/styled';


export type SetUpStackParamList = {
    PhotoModal: {
        devices?: Record<string, CameraDevice>;
        setNewPhoto?: (val: string) => void
    };
    SetUpProfile?: undefined;
    MediaSearch?: {
        activeUri: string;
    };
    UserProfile?: {
        activeUri: string;
    };
    PhotoTaken: {
        activeUri: string;
    }
}

export type RouteDeviceParam = {
    params: {
        devices?: Record<string, CameraDevice>;
        activeUri?: string;
    }
}

export type RoutePhotoUriParam = {
    params: {
        devices?: Record<string, CameraDevice>;
        activeUri: string;
    }
}


export const PhotoModal = () => {

    const route = useRoute<RouteProp<RouteDeviceParam>>();
    const navigation = useNavigation<NavigationProp<SetUpStackParamList>>();
    
    const { devices } = route.params;
    const [device, setDevice] = useState(devices?.front || devices?.back || devices?.external || devices?.unspecified);
    const [isActive, setActivity] = useState(true);
    const camera = useRef<Camera>(null);

    const dummyProfilePic = require("../../../assets/BaseApp/account.png");
    const dummyProfilePicUri = Image.resolveAssetSource(dummyProfilePic).uri;
    const [takenPhotoUri, setTakenPhotoUri] = useState(dummyProfilePicUri);

    


    const renderCamera = () => {
        if (device) {
            return (
                <Camera
                    photo={true}
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={isActive}
                    audio={false}
                    
                />
            )
        } else {
            Alert.alert("No working camera found");
        }
    };

    const switchCameraView = () => {
        if (device === devices?.front) {
            setDevice(devices?.back);
        } else {
            setDevice(devices?.front);
        }
    }

    const handlePhoto = async () => {
        if (camera.current) {
            try {
            const photo = await camera.current.takePhoto({
                qualityPrioritization: 'quality',
                enableAutoRedEyeReduction: true
            });
            const newPhotoUri = "file://" + photo.path;
            setTakenPhotoUri(newPhotoUri);             
            } catch(e: any) {
                console.warn(e.message)
            }
        }
    };

    const handleGoBack = () => {
        setActivity(false); 
        navigation.goBack();
    }



    return(
        <>
            <CameraView>
                {renderCamera()}
                <CameraBottomView>
                    <ImageBox
                        onPress={() => navigation.navigate("PhotoTaken", {
                            activeUri: takenPhotoUri
                        })}>
                        <ProfilePic 
                            source={{uri: takenPhotoUri}}
                            resizeMode="contain"
                        />
                    </ImageBox>
                    <CameraButtonView onPress={handlePhoto}>
                        <CameraButton />
                    </CameraButtonView>
                    <ReverseBox onPress={switchCameraView}>
                        <Icon name={"camera-reverse-outline"} size={50} color="white" />
                    </ReverseBox>
                </CameraBottomView>
                
                <CloseView>
                    <TouchableOpacity
                        onPress={() => handleGoBack()}>
                        <CloseButton 
                        source={require("../../../assets/BaseApp/close.png")}
                        resizeMode="contain" 
                        />
                    </TouchableOpacity>    
                </CloseView>
            </CameraView>
        </>
    )
}