import React from 'react';
import { Modal, View, Text, Button } from 'react-native';
import { ModalView } from './styled';
import { CustomButton } from '../../common/CustomButton';
import { ProfileInputs } from './SetUpTabs';



export const ConfirmProfileInput = ({
    modalVisible, 
    handleModal,
    profileInputs
}: {modalVisible: boolean|undefined; 
    handleModal: () => void
    profileInputs: ProfileInputs
}) => {

    return(
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.translucentBG}>
                <CustomButton 
                    shape="circle"
                    size={30}
                    color={"black"} 
                    handlePress={handleModal} 
                    styleContainer={styles.exitButton} />
                <ModalView>
                    <View>
                        <Text>{profileInputs.name}</Text>
                    </View>
                    <Text></Text>
                    <Text>{profileInputs.partnerEmail}</Text>
                    <Text></Text>
                    <Text>{profileInputs.bdate}</Text>
                    <Text></Text>
                    <Text>{profileInputs.annidate}</Text>
                    <Text></Text>
                    <Button 
                    title={"Update"}
                    />
                </ModalView>
            </View>
        </Modal>
    )   
}


const styles = {

    translucentBG: {
        backgroundColor: 'hsla(211, 12%, 48%, 0.9)',
        height: '100%'

    },

    exitButton: {
        backgroundColor: 'transparent',
        position: 'absolute',
        marginTop: 100,
        marginRight: 25,
        marginBottom: 100,
        marginLeft: 25,
        translateY: -15,
        translateX: -15,
        zIndex: 2
      }
}