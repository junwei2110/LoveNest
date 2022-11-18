import React, { ReactNode } from 'react';
import { TextProps, TouchableOpacity } from 'react-native';


export const IconFromNative = (props: {
    children: ReactNode;
    style?: TextProps;
    onClick?: () => void; 
}) => {

    return(
        <TouchableOpacity style={props.style} onPress={props.onClick}>
            {props.children}
        </TouchableOpacity>
    )
}