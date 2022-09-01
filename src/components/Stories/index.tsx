import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Store } from '../../data';

export const Stories = () => {

    const [globalState, dispatch] = useContext(Store);
    const { currentUser } = globalState;
    let injectedCode;
   
    if (currentUser) {
        const userData = JSON.stringify({
            name: currentUser.get('avatarName'),
            coupleId: currentUser.get('coupleId')
        });
        injectedCode = `
            window.userData = ${userData}
        `
    }

    return (
        <WebView
        source={{ uri: 'http://localhost:3000' }}
        injectedJavaScript={injectedCode} 
        />
    )
}