import React, { useState, useContext } from 'react';
import { Text, TextInput, View, ViewProps, TouchableOpacity, ScrollView } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Parse from 'parse/react-native.js';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';

import { Store } from '../../data';
import { userLoggingInit, userLoggingEnd } from "../../data/actions"
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigateBackToPhotos = {
    MediaSearch: undefined
}

export const PicDescModal = ({photoUri} : {
    photoUri: string
}) => {

    const [globalState, dispatch] = useContext(Store);
    const { currentUser } = globalState;
    const [caption, setCaption] = useState("");
    const [tags, setTags] = useState<Record<string, any>[]>([]);
    const [newTag, setNewTag] = useState("");
    const navigation = useNavigation<NativeStackNavigationProp<NavigateBackToPhotos>>();


    const addTag = () => {
        if (newTag) {
            const newTagObj = {
                id: newTag.concat(new Date().toISOString()),
                text: newTag
            }
            setTags((state) => [...state, newTagObj]);
            setNewTag("");
        }     
    }

    const deleteTag = (idx: number) => {
        const tagsArr = [...tags];
        tagsArr.splice(idx, 1);
        setTags(() => [...tagsArr]);
    }

    const saveImg = async () => {
        try {
            dispatch(userLoggingInit());
            const base64NewPic = await RNFS.readFile(photoUri, 'base64');
            const parseFile = new Parse.File(caption, {base64: base64NewPic});
            const responseFile = await parseFile.save();
            const savePicQuery = new Parse.Object("Photo");
            savePicQuery.set('title', caption);
            savePicQuery.set('dateTime', new Date().toDateString());
            savePicQuery.set('tags', tags);
            savePicQuery.set('userOrCoupleId', currentUser?.get("coupleId"));
            savePicQuery.set('photoStorage', responseFile);
            await savePicQuery.save();

            dispatch(userLoggingEnd());
            Toast.show({
                type: "success",
                text1: "Picture saved"
            });
            //TODO: Dispatch action here to save it to the context store
            //Improvement: Use redis cache
            navigation.navigate("MediaSearch");
        } catch(e) {
            dispatch(userLoggingEnd());
            Toast.show({
                type: "error",
                text1: "Picture failed to save"
            });

        }
        

    }   

    return (
        <>
            <View style={style.captionContainer as ViewProps}>
                <Text>Caption: </Text>
                <TextInput 
                style={style.caption} 
                placeholder={"Insert something here"} 
                onChangeText={(text) => setCaption(text)}
                value={caption}
                />
            </View>
            <View style={style.tagContainer as ViewProps}>
                <Text>Tags: </Text>
                <View style={style.tagAndButton as ViewProps}>
                    <TextInput 
                    style={style.tags} 
                    placeholder={"Add the tags here"}
                    value={newTag} 
                    onChangeText={(text) => setNewTag(text)}
                    />
                    <TouchableOpacity 
                    style={style.button as ViewProps} 
                    onPress={addTag}
                    >
                        <Text>Add</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={style.scrollViewTags}>
                    <View style={style.tagDisplayContainer as ViewProps}>
                        {tags.length ? 
                            tags.map((tag, idx) => (
                                <TagLabel 
                                key={tag.id}
                                item={tag.text} 
                                idx={idx}
                                deleteFunc={deleteTag}
                                />
                            ))
                        : null}
                    </View>
                </ScrollView>
            </View>
            <TouchableOpacity
            style={style.updateBtnContainer as ViewProps}
            onPress={saveImg} 
            >
                <Text style={style.updateBtn as ViewProps}>Add Image</Text>
            </TouchableOpacity>
        </>
    )
}


const TagLabel = ({item, idx, deleteFunc} : {
    item: string;
    idx: number;
    deleteFunc: (idx: number) => void;
}) => {

    return (
        <View style={style.individualTag as ViewProps}>
            <Text numberOfLines={1} style={style.individualTagText}>
                {item}
            </Text>
            <BouncyCheckbox 
            isChecked={true} 
            onPress={() => deleteFunc(idx)}
            />
        </View>
    )

}


const style = {
    captionContainer: {
        alignItems: "center",
        width: "100%",
        marginTop: 10,
    },
    caption: {
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 25,
        paddingLeft: 20,
        width: "85%",

    },
    tagContainer: {
        alignItems: "center",
        marginTop: 10,
        
    },
    tagAndButton: {
        display: "flex",
        flexDirection: "row",
        marginHorizontal: 20,
        width: "85%",
        marginTop: 5,
    },
    tags: {
        flex: 5,
        borderWidth: 1,
        borderRadius: 25,
        paddingLeft: 20,

    },
    button: {
        flex: 2,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        marginLeft: 10,
    },
    tagDisplayContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        marginLeft: -5
    },
    individualTag: {
        display: "flex",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: 10,
        paddingVertical: 5,
        marginTop: 5,
        marginLeft: 5,

    },
    individualTagText: {
        marginRight: 10
    },
    scrollViewTags: {
        contentContainerStyle: {
            flexGrow: 1,
            flexDirection: 'row', 
            alignItems: "center",
            justifyContent: "center"
        },
        width: "85%",
        height: "50%",
    },
    updateBtnContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    updateBtn: {
        borderWidth: 1,   
        width: "30%",
        textAlign: "center",
        padding: 10,

    }

}
