import React, { useState, useContext } from 'react';
import { Modal, Image, Button, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { InPageModal } from '../../common/InPageModal';
import { Store } from '../../data';
import { userLoggingInit, userLoggingEnd } from '../../data/actions';
import { RoutePhotoUriParam, SetUpStackParamList } from './PhotoModal';
import { CloseButton } from '../../common/CustomButton/CloseButton';
import { PicDescModal } from './DescriptionModal';





export const PhotoTaken = () => {

    const [globalState, dispatch] = useContext(Store);
    const navigation = useNavigation<NavigationProp<SetUpStackParamList>>();
    const route = useRoute<RouteProp<RoutePhotoUriParam>>();
    const takenPhotoUri = route.params.activeUri;

    const [isDescModalVisible, setDescModalVisible] = useState(false);



    const setProfilePic = async () => {
        try {
            dispatch(userLoggingInit());
            navigation.navigate("UserProfile", {
                activeUri: takenPhotoUri
            })

        } catch(e: any) {
            dispatch(userLoggingEnd());
            Toast.show({
                type: "error",
                text1: "Picture failed to save"
            });

        }
    }


    return (
        <>
        <InPageModal
            visible={isDescModalVisible}
            size={75}>
            <>
                <CloseButton
                handleModal={() => setDescModalVisible(false)}
                small={true} />
                <PicDescModal photoUri={takenPhotoUri} />
            </>
        </InPageModal>
        <Modal>
            <Image
                style={{flex: 1, width: undefined, height: undefined}}
                source={{uri: takenPhotoUri}}
                resizeMode="contain"
            />
            <Button 
            title="Set Profile Picture"
            onPress={setProfilePic} />
            <Text></Text>
            <Button 
            title="Save in Photo Gallery"
            onPress={() => setDescModalVisible(true)} />
            <Text></Text>
            <Button 
            title="Retake Photo"
            onPress={() => navigation.navigate("PhotoModal", {})} />

        </Modal>
        </>
    )


}