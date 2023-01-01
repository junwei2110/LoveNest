import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Button, KeyboardAvoidingView, Dimensions, Keyboard } from 'react-native';
import { WebView } from 'react-native-webview';
import { useHeaderHeight } from '@react-navigation/elements';

import { Store } from '../../data';
import { SetUpStackParamList } from '../PhotoModal/PhotoModal';

declare global {
    interface window {
        renderApp: () => void;
    }
  }

export const Stories = () => {

    const [globalState, dispatch] = useContext(Store);
    const { currentUser } = globalState;
    const userId = currentUser?.id;
    const partnerId = currentUser?.get("partnerId");
    const coupleId = currentUser?.get("coupleId");

    const WebviewRef = useRef<View>(null);
    const [viewStyle, setStyle] = useState<Record<string, any>>({ height: "100%" });

    useEffect(() => {

        const keyboardDidShow = (e: any) => {
            if (WebviewRef.current) {
                WebviewRef.current.measure((_fx: number, _fy: number, _w: number, h: number, _px: number, _py: number) => {
                    //console.log(_fx, _fy, _w, h, _px, _py);
                    setStyle({ height: h - e.endCoordinates.height + _py})
                })
            }     
        }

        const keyboardDidHide = (_e: any) => {
            setStyle({ height: "100%" })
        }
        const showListener = Keyboard.addListener("keyboardDidShow", keyboardDidShow);
        const hideListener = Keyboard.addListener("keyboardDidHide", keyboardDidHide);

        return () => {
            showListener.remove();
            hideListener.remove();
        }
    }, []);

    const currentUserCred = JSON.stringify({
        id: userId,
        coupleId,        
    });

    const loadChat = `
        window.renderApp('${currentUserCred}');   
        true; // note: this is required, or you'll sometimes get silent failures
    `;

    return (
        <View ref={WebviewRef} style={viewStyle} collapsable={false}>
            {userId !== coupleId ? 
                <WebView
                    source={{ uri: 'http://localhost:3000' }}
                    injectedJavaScript={loadChat}
                    scrollEnabled={false}
                />        
            :
            <EmptyView {...{ partnerId }} />
            }
        </View>
    )
}


const EmptyView = ({partnerId}: {partnerId: string}) => {

    const navigation = useNavigation<NavigationProp<SetUpStackParamList>>();

    return (   
            <View style={{height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
            {partnerId !== "pending" ?
                <>
                    <Text>You have not set your partner</Text>
                    <Text></Text>
                    <Button
                        title={"Click here to update your partner"}
                        onPress={() => navigation.navigate("UserProfile")} />
                </>
                :
                <Text>Pending for your partner's response</Text> 
            }
            </View>
            
    )

}

