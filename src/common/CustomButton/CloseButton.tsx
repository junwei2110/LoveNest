import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

type CloseButtonProps = {
    small?: boolean;
}

const CloseButtonImage = styled.Image<CloseButtonProps>`
    height: ${props => props.small ? "15px" : "25px"};
    width: ${props => props.small ? "15px" : "25px"};
    margin-left: 15px;
    margin-top: ${props => props.small ? "10px" : 0};
    
`


export const CloseButton = ({handleModal, small}:{
    handleModal: () => void;
    small: boolean;
}) => {


    return (
        <TouchableOpacity onPress={handleModal}>
            <CloseButtonImage
                small={small} 
                source={require("../../../assets/BaseApp/close.png")} 
                />
        </TouchableOpacity>
    )
}