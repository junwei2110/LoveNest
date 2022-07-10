import React from 'react';
import { LoginView } from './styled';
import { LoginForm } from './LoginForm';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LoginStackParamList } from '../../../types';

type Props = NativeStackScreenProps<LoginStackParamList, 'Login'>;

export const LoginPage = ({navigation}: {navigation: Props['navigation']}) => {

    return (
        <LoginView>
            <LoginForm navigation={navigation}/>
        </LoginView>
    )

}


