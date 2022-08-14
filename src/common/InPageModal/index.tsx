import React, { ReactElement } from 'react';
import { Modal, View } from 'react-native';
import styled from 'styled-components/native';


export const InPageModal = ({children, visible} : {
    children: ReactElement;
    visible: boolean;
}) => {

    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={visible}>
            <View style={styles.translucentBG}>      
                    <ConfirmationModalOverallView>
                        {children}
                    </ConfirmationModalOverallView>
            </View>  
        </Modal>
    )
}


const styles = {

    translucentBG: {
        backgroundColor: 'hsla(211, 12%, 48%, 0.8)',
        height: '100%'

    },
}

export const ConfirmationModalOverallView = styled.View`
    margin: 25% 5%;
    background-color: white;
    height: 75%;
    border-radius: 10px;
    border-width: 3px;
    
`