import React, { useState, useContext } from 'react';
import { Alert, Text } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Parse from "parse/react-native.js";
import messaging from "@react-native-firebase/messaging";
import {APP_NAME, GCM_SENDER_ID, PACKAGE_NAME} from 'react-native-dotenv';
import uuid from 'react-native-uuid';

import { userLoggingInit, userLogin, userLoginFailure } from '../../data/actions';
import { LoginTextInput, LoginImage, LoginButton } from './styled';
import type { LoginStackParamList } from '../../../types';
import { Store } from '../../data';

type Props = NativeStackScreenProps<LoginStackParamList, 'Login'>;

export const LoginForm = ({navigation}: {navigation: Props['navigation']}) => {

    const [globalState, dispatch] = useContext(Store)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const doUserLogin = async () => {

        dispatch(userLoggingInit());

        const usernameVal = username;
        const passwordVal = password;

        Parse.User.logIn(usernameVal, passwordVal)
            .then(async (loggedInUser) => {
                
                const deviceToken = await messaging().getToken();

                await Parse.Cloud.run("updateUserIdInstallation", {
                    deviceToken,
                    userId: loggedInUser.id,
                });

                if (!loggedInUser?.get("coupleId")) {
                    loggedInUser?.set("coupleId", loggedInUser?.id);
                    await loggedInUser?.save();
                }
                dispatch(userLogin(loggedInUser));

            }).catch((e) => {
                Alert.alert('Error!', e.message);
                dispatch(userLoginFailure());
                return false;
            })
    }



    return (
        <>
            <LoginImage source={require("../../../assets/Login/login.png")} />
            <LoginTextInput 
                placeholder='Username'
                onChangeText={(text) => setUsername(text)}
                autoCapitalize={'none'}
                
            />
            <LoginTextInput 
                placeholder='Password'
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />
            
            <LoginButton
                onPress={doUserLogin}
            >
            <Text>Submit</Text>
            </LoginButton>

            <BouncyCheckbox 
                size={20} 
                textComponent={<Text>   Sign Up Alone or with Your Partner  </Text>}
                onPress={() => navigation.navigate('SignUp')}
                isChecked={true}
                disableBuiltInState
            />
            <Text></Text>
            <BouncyCheckbox 
                size={20} 
                textComponent={<Text>   Forget your password?  </Text>}
                onPress={() => navigation.navigate('ResetPassword')}
                isChecked={true}
                disableBuiltInState
            />
        </>
    )

}