import React, { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Text, View, ViewProps, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Parse from 'parse/react-native.js';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';

import { Loader } from '../../common/Loader/Loader';
import { CloseButton } from '../../common/CustomButton/CloseButton';
import { Store } from '../../data';
import { NavigateBackToPhotos } from '../PhotoModal/DescriptionModal';



type ImageObj = {
    id: string;
    uri: string;
    caption?: string;
    tags?: Record<string, any>[];
}

type FlatListImages = ImageObj & {
    onPressImg: (img: ImageObj) => void;
}

export const ImageView = () => {

    const [globalState, dispatch] = useContext(Store);
    const { currentUser } = globalState;

    const route = useRoute<RouteProp<NavigateBackToPhotos>>();
    
    const [loading, setLoading] = useState(true);
    const [photoArr, setPhotoArr] = useState<FlatListImages[]>([]);
    const [activeImg, setActiveImg] = useState<ImageObj | undefined| null>(null);

    const id = route.params?.id;
    const newPhotoUri = route.params?.newPhotoUri;
    const caption = route.params?.caption;
    const tags = route.params?.tags;

    const onPressImg = (img: ImageObj) => {
        setActiveImg(img);
    };
    
    
    const retrieveImagesFromParse = async () => {

        try {
            const imageObjQuery = new Parse.Query("Photo");
            imageObjQuery.containedIn('userOrCoupleId', [currentUser?.id, currentUser?.get("coupleId")]);
            imageObjQuery.addDescending("updatedAt");
            const imageObjResponse = await imageObjQuery.find();
            const photoArrayFromParse = 
                imageObjResponse.map((imageObj) => {
                    return {
                        id: imageObj.id, 
                        uri: imageObj.get("photoStorage").url(),
                        caption: imageObj.get("title"),
                        tags: imageObj.get('tags'),
                        onPressImg
                    };
            });

            setPhotoArr(() => [...photoArrayFromParse]);
            setLoading(false);
        } catch(e) {
            setLoading(false);
            Alert.alert("Failed to retrieve photos");
        }
    }

    useEffect(() => {
        retrieveImagesFromParse();
    }, []);

    useEffect(() => {
        if (id && newPhotoUri) {
            setPhotoArr((state) => [{
                id, 
                uri: newPhotoUri, 
                caption, 
                tags, 
                onPressImg
            }, ...state]);
        }

    }, [id, newPhotoUri])



    return (
        <>
            {activeImg ? renderFullScaleImage({ item: activeImg, setActiveItem: setActiveImg}) : null}
            {loading ? 
                <Loader screenOpacity='transparent' /> 
            :
                photoArr.length ? 
                    <FlatList
                    numColumns={3}
                    data={photoArr}
                    renderItem={renderImages} />
                    
                :
                    <View style={{alignItems: "center", justifyContent: "center", height: "85%"}}> 
                        <Icon name="emoji-sad" size={100} color={"black"} />
                        <Text style={{marginTop: 10}}>No pictures found</Text>
                    </View>
            }
        </>
    )

}


const renderImages = ({item}: {item: FlatListImages}) => {

    const selectedItem = {
        id: item.id,
        uri: item.uri,
        caption: item.caption,
        tags: item.tags,
    }

    return (
        <TouchableOpacity
        key={item.id}
        style={styles.IndivImageContainer}
        onPress={() => {
            item.onPressImg(selectedItem)
        }}
        >
            <FastImage 
                source={{ uri: item.uri }} 
                resizeMode={"contain"}
                style={styles.IndivImage}
                />
        </TouchableOpacity>

    )
}

const renderFullScaleImage = ({ item, setActiveItem }: {
    item: ImageObj;
    setActiveItem: (item: ImageObj | null) => void;
}) => {

    return (
        <Modal style={{backgroundColor: "black"}}>
            <CloseButton
                handleModal={() => setActiveItem(null)}
                small={true} />
            <View style={{width: "100%", height: "70%"}}>
                <FastImage 
                    source={{ uri: item.uri }} 
                    resizeMode={"contain"}
                    style={styles.IndivImage}
                    />
            </View>
            <View style={{width: "100%", height: "30%", alignItems: "center"}}>
                <Text style={{fontSize: 20}}>{item.caption}</Text>
                <ScrollView style={styles.scrollViewTags}>
                    <View style={styles.tagDisplayContainer as ViewProps}>
                        {item.tags?.length ? 
                            item.tags.map((tag, idx) => (
                                <Text key={tag.id}>{tag.text}</Text>
                            ))
                        : null}
                    </View>
                </ScrollView>
            </View>
        </Modal>
        

    )
}


const styles = {
    IndivImageContainer: {
        flex: 1/3,
        height: 100,
        borderWidth: 1/3,
        margin: 1,
        backgroundColor: "black"
    },

    IndivImage: {
        flex: 1,
        width: undefined,
        height: undefined
    },
    scrollViewTags: {
        contentContainerStyle: {
            flexGrow: 1,
            flexDirection: 'row', 
        },
        width: "85%",
    },
    tagDisplayContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        marginLeft: -5,
        paddingVertical: 10
        
    },
}
