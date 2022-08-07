import React, { useState, useRef, useContext } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, Modal, Button } from 'react-native';
import { Camera, CameraDevice } from 'react-native-vision-camera';
import { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Parse from 'parse/react-native.js';
import RNFS from 'react-native-fs';

import { 
    ImageBox,
    CameraButton, 
    CameraBottomView,
    CameraButtonView, 
    CameraView,
    CloseView,
    CloseButton, 
    ProfilePic} from './styled';

import { Store } from '../../data';

type RouteDeviceParam = {
    params: {device: CameraDevice;
            setNewPhoto: (val: string) => void}
}


export const PhotoModal = () => {

    const route = useRoute<RouteProp<RouteDeviceParam>>();
    const navigation = useNavigation();

    const [globalState, dispatch] = useContext(Store);
    const { currentUser } = globalState;
    
    const [isActive, setActivity] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const camera = useRef<Camera>(null);

    const dummyProfilePic = require("../../../assets/BaseApp/account.png");
    const dummyProfilePicUri = Image.resolveAssetSource(dummyProfilePic).uri;
    const [takenPhotoUri, setTakenPhotoUri] = useState(dummyProfilePicUri);

    const { device, setNewPhoto } = route.params;

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

    const setProfilePic = async () => {
        if (currentUser) {
            try {

                const base64ProfilePic = await RNFS.readFile(takenPhotoUri, 'base64');
                const parseFile = new Parse.File("profilePic", {base64: base64ProfilePic});
                const responseFile = await parseFile.save();
                currentUser.set('profilePic', responseFile);
                await currentUser.save();
                setNewPhoto(takenPhotoUri);
                //TODO: Loading Screen to show uploading in process
                //TODO: Toast message to say picture is saved
                handleGoBack();
                console.log("Picture saved!");

            } catch(e: any) {
                console.log(e.message);
                console.log("Picture failed to save. Please try again");
                setIsVisible(false);

            }
        }                     
    } 

    return(
        <>
            <Modal visible={isVisible}>
                    <ProfilePic
                        source={{uri: takenPhotoUri}}
                        resizeMode="contain"
                    />
                    <Button 
                    title="Set Profile Picture"
                    onPress={setProfilePic} />
                    <Text></Text>
                    <Button 
                    title="Retake Photo"
                    onPress={() => setIsVisible(false)} />
                
            </Modal>
            <CameraView>
                <Camera
                    photo={true}
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={isActive}
                    audio={false}
                    
                />
                <CameraBottomView>
                    <ImageBox
                        onPress={() => setIsVisible(true)}>
                        <ProfilePic 
                            source={{uri: takenPhotoUri}}
                            resizeMode="contain"
                        />
                    </ImageBox>
                    <CameraButtonView>
                        <CameraButton onPress={handlePhoto}>
                            <Text>Hello, Smile!</Text>
                        </CameraButton>
                    </CameraButtonView>
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