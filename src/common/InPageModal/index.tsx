import React, { ReactElement } from 'react';
import { Modal, View, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';
import styled from 'styled-components/native';


export const InPageModal = ({children, visible, size, center, returnFn} : {
    children: ReactElement;
    visible: boolean;
    size?: number;
    center?: boolean;
    returnFn?: () => void;
}) => {

    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={visible}>
            <TouchableOpacity 
            style={styles.translucentBG}
            onPress={returnFn}
            disabled={!returnFn}
            >      
                    <ConfirmationModalOverallView size={size} center={center}>
                        {children}
                    </ConfirmationModalOverallView>
            </TouchableOpacity>  
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

const viewHeight = Dimensions.get('window').height;
const viewWidth = Dimensions.get('window').width; 

export const ConfirmationModalOverallView = styled.View<ViewProps>`
    margin: ${props => props.size ? `${100 - props.size}% 5%` : `25% 5%`};
    background-color: #fad9c1;
    height: ${props => props.size ? props.size/100 * viewHeight : viewHeight * 3/4};
    border-radius: 10px;
    border-width: 3px;
    ${props => props.center && "justifyContent: center"};
    
`