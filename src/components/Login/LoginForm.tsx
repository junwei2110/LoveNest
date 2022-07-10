import React, { useState } from 'react';
import { Modal, Text } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { LoginTextInput, LoginImage, LoginButton, CheckBoxView } from './styled';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LoginStackParamList } from '../../../types';

type Props = NativeStackScreenProps<LoginStackParamList, 'Login'>;

export const LoginForm = ({navigation}: {navigation: Props['navigation']}) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    return (
        <>
            <LoginImage source={require("../../../assets/Login/login.png")} />
            <LoginTextInput 
                placeholder='Username'
                onChangeText={(text) => setUsername(text)}
            />
            <LoginTextInput 
                placeholder='Password'
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />
            <CheckBoxView>
                <BouncyCheckbox 
                    size={20} 
                    textComponent={<Text>   Keep me signed in   </Text>}
                />
            </CheckBoxView>
            

            <LoginButton
                onPress={() => console.log("Login Request submitted")}
            >
            <Text>Submit</Text>
            </LoginButton>

            <CheckBoxView>
                <BouncyCheckbox 
                    size={20} 
                    textComponent={<Text>   Sign Up Alone or with Your Partner  </Text>}
                    onPress={() => navigation.navigate('SignUp')}
                />
            </CheckBoxView>

        </>
    )

}