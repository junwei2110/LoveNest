import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import styled from 'styled-components/native';

const BaseIconImage = styled.Image`
    width: 16px;
    height: 16px;
` 

export const BaseIcon = ({source} : {source:ImageSourcePropType}) => {
    return (
        <BaseIconImage source={source} />
    )
}
