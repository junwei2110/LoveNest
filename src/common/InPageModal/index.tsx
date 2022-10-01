import React, { ReactElement } from 'react';
import { Modal, View } from 'react-native';
import styled from 'styled-components/native';


export const InPageModal = ({children, visible, size, center} : {
    children: ReactElement;
    visible: boolean;
    size?: number;
    center?: boolean;
}) => {

    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={visible}>
            <View style={styles.translucentBG}>      
                    <ConfirmationModalOverallView size={size} center={center}>
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

type ViewProps = {
    size?: number;
    center?: boolean
}

export const ConfirmationModalOverallView = styled.View<ViewProps>`
    margin: ${props => props.size ? `${100 - props.size}% 5%` : `25% 5%`};
    background-color: white;
    height: ${props => props.size ? `${props.size}%` : `75%`};
    border-radius: 10px;
    border-width: 3px;
    ${props => props.center && "justifyContent: center"};
    
`