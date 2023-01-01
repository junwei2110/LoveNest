import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const UserIcon = ({directToProfile} : {directToProfile: () => void}) => {

    return (
        <TouchableOpacity onPress={directToProfile}>
            <Icon name="md-person-circle-outline" size={24} color="black" />
        </TouchableOpacity>
    )
}