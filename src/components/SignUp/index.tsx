import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import { SignUpView, SignUpTextInput, SignUpImage, SignUpButton } from './styled';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LoginStackParamList } from '../../../types';
import { StackActions } from '@react-navigation/native';
import Parse from "parse/react-native.js";
import messaging from "@react-native-firebase/messaging";

type Props = NativeStackScreenProps<LoginStackParamList, 'Login'>;

export const SignUpPage = ({navigation}:{navigation: Props['navigation']}) => {

    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    
    const userRegistration = async () => {
        if (password1 !== password2) {
            return Alert.alert('Error!', 'Please ensure re-typed password is the same')
        }

        const usernameVal = email;
        const passwordVal = password1;
        const deviceToken = await messaging().getToken();
        
        const signUpAddParams = {
            email: usernameVal,
            firstTimerProfile: true,
            deviceRegistered: deviceToken
        }

        try {
            const newUser = await Parse.User.signUp(usernameVal, passwordVal, signUpAddParams)

            console.log("just signed up", newUser.id);
            await Parse.Cloud.run("firstSignUpUserIdInstallation", {
                userId: newUser.id,
                deviceToken
            });

            await Parse.User.logOut();
            Alert.alert('Success!', `User was successfully created. Please verify your email to login`);
            navigation.dispatch(StackActions.popToTop());

        } catch(e: any) {
            Alert.alert('Error!', e.message);
        }
        
    };



    return (
        <SignUpView>
            <SignUpImage source={require("../../../assets/Login/sign-up.png")} />

            <SignUpTextInput
                placeholder={"Email Address"}
                autoCapitalize={'none'}
                onChangeText={(text) => setEmail(text)}
            />
            <SignUpTextInput
                placeholder={"Password"}
                secureTextEntry={true}
                onChangeText={(text) => setPassword1(text)}
            />
            <SignUpTextInput
                placeholder={"Re-type Password"}
                secureTextEntry={true}
                onChangeText={(text) => setPassword2(text)}
            />
            <SignUpButton
                onPress={() => userRegistration()}
            >
                <Text>Sign Up</Text>
            </SignUpButton>
        </SignUpView>
    )
}