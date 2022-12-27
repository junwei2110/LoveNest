import React, { useState } from 'react';
import { View, TextInput, Text, Button } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Parse from 'parse/react-native.js';
import Toast from 'react-native-toast-message';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { LoginStackParamList } from '../../../types';

export const PasswordReset = () => {

    const [email, setEmail] = useState("");
    const navigation = useNavigation<NavigationProp<LoginStackParamList>>();

    const handleSubmit = async () => {
        try {
            await Parse.User.requestPasswordReset(email);
            Toast.show({
                type: "success",
                text1: "Email sent! Check your inbox"
            })
            navigation.navigate("Login")
        } catch (e: any) {
            Toast.show({
                type: "error",
                text1: "Error processing request"
            })
        }
        


    }

    return (
        <View style={{height: "60%", width: "100%", alignItems: "center", justifyContent: "space-around"}}>
            <View style={{alignItems: "center"}}>
                <Icon name="account-search" size={100} color="black" />
                <Text>We will send you a reset password link</Text>
            </View>
            <View style={{width: "100%", alignItems: "center"}}>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    placeholder='Email Address' 
                    style={{borderWidth: 1, borderRadius: 25, width: "90%", paddingLeft: 20}}/>
                <Text></Text>
                <Button title={"Search!"} onPress={handleSubmit} />
            </View>
        </View>
    )

}
