import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, Image, Alert, Modal, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Parse from "parse/react-native.js";
import { useCameraDevices, Camera, CameraDevice } from 'react-native-vision-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from "react-native-image-picker"
import { MediaType } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';

import { SetUpProfilePicView, ImageBox2, ProfilePic, ProfilePicUpdateBox, CloseView, CloseButton } from "./styled";

import { userLoggingInit, userLoggingEnd, userLogout } from '../../data/actions';
import { Store } from '../../data';
import { RouteDeviceParam, SetUpStackParamList } from '../PhotoModal/PhotoModal';



export type MediaOptions = {
    mediaType: MediaType
    includeBase64: boolean;
}

export const UserProfile = () => {

    const route = useRoute<RouteProp<RouteDeviceParam>>()
    const navigation = useNavigation<NativeStackNavigationProp<SetUpStackParamList>>();
    const [globalState, dispatch] = useContext(Store);
    const { currentUser } = globalState;
    const firstTimerProfile = currentUser && currentUser.get("firstTimerProfile");
    const [isVisible, setIsVisible] = useState(false);
    
    const dummyProfilePic = require("../../../assets/BaseApp/account.png");
    const dummyProfilePicUri = Image.resolveAssetSource(dummyProfilePic).uri;
    const currentProfilePicPath = currentUser && currentUser.get("profilePic").url() || dummyProfilePicUri;
    const [photoPath, setPhotoPath] = useState(currentProfilePicPath);

    const devices = useCameraDevices();
    const [camPermStatus, setCamPermStatus] = useState(false);
    const activeUri = route?.params?.activeUri;

    useEffect(() => {
        const checkCameraPermission = async () => {
            const status = await Camera.getCameraPermissionStatus();
            setCamPermStatus(status === "authorized");
        }

        checkCameraPermission();
    }, [camPermStatus]);

    useEffect(() => {
        if (activeUri) {
            saveProfilePic(activeUri);
        }
    }, [activeUri]);

    const saveProfilePic = async (activeUri: string) => {
        try {
            const base64ProfilePic = await RNFS.readFile(activeUri, 'base64');
            const parseFile = new Parse.File("profilePic", {base64: base64ProfilePic});
            const responseFile = await parseFile.save();
            currentUser?.set('profilePic', responseFile);
            await currentUser?.save();
            setPhotoPath(activeUri)
            dispatch(userLoggingEnd());
            Toast.show({
                type: "success",
                text1: "Picture saved"
            });
        } catch(e) {
            dispatch(userLoggingEnd());
            Toast.show({
                type: "error",
                text1: "Picture failed to save"
            });

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


    const handleLogout = () => {
        dispatch(userLoggingInit());
        Parse.User.logOut();
        dispatch(userLogout());
    };



    return (
        <> 
            <Modal visible={isVisible}>
                <ProfilePic
                    source={{uri: photoPath}}
                    resizeMode="contain"
                />
                <CloseView>
                    <TouchableOpacity
                        onPress={() => setIsVisible(false)}>
                        <CloseButton 
                        source={require("../../../assets/BaseApp/close.png")}
                        resizeMode="contain" 
                        />
                    </TouchableOpacity>    
                </CloseView>                
            </Modal>

            <View>
                <Text></Text>
                <SetUpProfilePicView>
                    <ImageBox2
                        onPress={() => setIsVisible(true)}>
                        <ProfilePic
                        source={{uri: photoPath}}
                        resizeMode="contain"
                         />
                    </ImageBox2>
                    <ProfilePicUpdateBox>
                        {devices && camPermStatus &&
                        <Button 
                            title={"Take a Photo"}
                            onPress={() => navigation.navigate('PhotoModal', 
                            {devices: devices as Record<string, CameraDevice>})}
                        />
                        }
                        <Button 
                            title={"Upload a Photo"}
                            onPress={handleChoosePhoto}
                        />
                    </ProfilePicUpdateBox>
                </SetUpProfilePicView>
                <Text></Text>
                {firstTimerProfile &&
                <Button 
                    title={"Complete your Profile"}
                    onPress={() => navigation.navigate('SetUpProfile')}
                />}
                <Text></Text>
                <Button 
                    title={"Log Out"}
                    onPress={handleLogout}
                />
            </View>
        </>
    )
}