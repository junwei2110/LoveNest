import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, Image, Alert, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Parse from "parse/react-native.js";
import { useCameraDevices, Camera, CameraDevice } from 'react-native-vision-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from "react-native-image-picker"
import { MediaType } from 'react-native-image-picker';

import { Loader } from '../../common/Loader/Loader';
import { SetUpProfilePicView, ImageBox2, ProfilePic, ProfilePicUpdateBox, CloseView, CloseButton } from "./styled";

import { userLoggingInit, userLogout } from '../../data/actions';
import { Store } from '../../data';


type SetUpStackParamList = {
    PhotoModal: {device: CameraDevice;
        setNewPhoto: (val: string) => void};
    SetUpProfile: undefined
}

type MediaOptions = {
    mediaType: MediaType
    includeBase64: boolean;
}

export const UserProfile = () => {

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
    const device = devices.front;
    const [camPermStatus, setCamPermStatus] = useState(false);

    useEffect(() => {
        const checkCameraPermission = async () => {
            const status = await Camera.getCameraPermissionStatus();
            setCamPermStatus(status === "authorized");
        }

        checkCameraPermission();
    }, [camPermStatus]);

    /* Not required
    useEffect(() => {

        const getUserDetails = async () => {
            const { currentUser } = globalState;
            const parseQuery = new Parse.Query(Parse.User);
            currentUser && parseQuery.equalTo('objectId', currentUser.id)
            try {
                const userDetails = await parseQuery.find();
                const isUserFirstTimer = userDetails[0].get('firstTimerProfile');
                const isUserPartnerFirstTimer = userDetails[0].get('firstTimerRelationship')
                setFirstTimerProfile(isUserFirstTimer);
                setFirstTimerRelationship(isUserPartnerFirstTimer);
                setLoading(false);
            } catch(e:any) {
                Alert.alert("Error!", e.message);
            };
        }        
        getUserDetails();

    }, [loading, firstTimerProfile, firstTimerRelationship])
    */
    const handleChoosePhoto = () => {
        const options: MediaOptions = {
            mediaType: "photo",
            includeBase64: true,
          };
        ImagePicker.launchImageLibrary(options, async (response) => {
            if (response.uri && response.base64 && currentUser) {
            
                console.log(response.uri);
                
                const parseFile = new Parse.File("ProfilePic", {base64: response.base64});
                console.log(parseFile)
                try {
                    const responseFile = await parseFile.save();
                    console.log(responseFile)
                    currentUser.set('profilePic', responseFile);
                    console.log(currentUser);

                    //TODO: Loading Screen to show uploading in process
                    //TODO: Toast message to say picture is saved
                    await currentUser.save();
                    setPhotoPath(response.uri);
                    Alert.alert("Picture saved!");
                    
                } catch {
                    console.log("Picture failed to save. Please try again");
                    Alert.alert("Picture failed to save. Please try again");
                }
        }
        });

    };


    const handleLogout = () => {
        dispatch(userLoggingInit());
        Parse.User.logOut();
        dispatch(userLogout());
    };


    //{loading && <Loader />}
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
                        {device && camPermStatus &&
                        <Button 
                            title={"Take a Photo"}
                            onPress={() => navigation.navigate('PhotoModal', 
                            {device: device,
                            setNewPhoto: setPhotoPath})}
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