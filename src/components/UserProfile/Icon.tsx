import React from 'react';
import { TouchableOpacity } from 'react-native';
import { BaseIcon } from '../../common/icons/BaseIcon';

export const UserIcon = ({directToProfile} : {directToProfile: () => void}) => {

    return (
        <TouchableOpacity onPress={directToProfile}>
            <BaseIcon source={require('../../../assets/BaseApp/user.png')} />
        </TouchableOpacity>
    )
}