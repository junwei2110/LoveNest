import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import Parse from "parse/react-native.js";
import { userLogout } from '../../data/actions';
import { Store } from '../../data';

export const UserProfile = () => {

    const [globalState, dispatch] = useContext(Store);

    const handleLogout = () => {
        Parse.User.logOut();
        dispatch(userLogout());

    }

    return (
        <View>
            <Text>User Profile</Text>
            <Button 
                title={"Log Out"}
                onPress={handleLogout}
            />
        </View>
    )
}