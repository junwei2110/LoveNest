import React, { useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Parse from 'parse/react-native.js';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';

import { Loader } from '../../common/Loader/Loader';
import { Store } from '../../data';
import { userLoggingEnd } from '../../data/actions';
import { RouteDeviceParam } from '../PhotoModal/PhotoModal';




export const ImageView = () => {

    const [globalState, dispatch] = useContext(Store);
    const { currentUser } = globalState;
    const route = useRoute<RouteProp<RouteDeviceParam>>();
    const activeUri = route?.params?.activeUri;
    
    const [activePhotoUri, setActivePhotoUri] = useState("");
    const [loading, setLoading] = useState(true);
    const [photoArr, setPhotoArr] = useState([]);
    

    useEffect(() => {
        try{
            //Retrieve photo data from Parse
            console.log("Retrieving data again");
            setTimeout(() => setLoading(false), 2000);
        } catch(e) {
            setLoading(false);

        }
    }, []);

    useEffect(() => {

    })

    return (
        <>
            {loading ? 
                <Loader screenOpacity='transparent' /> 
            :
                photoArr.length ? 
                    <Text>Photos here</Text> 
                :
                    <View style={{alignItems: "center", justifyContent: "center", height: "85%"}}> 
                        <Icon name="emoji-sad" size={100} color={"black"} />
                        <Text style={{marginTop: 10}}>No pictures found</Text>
                    </View>
            }
        </>
    )

}