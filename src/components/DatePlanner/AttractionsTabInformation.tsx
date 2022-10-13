import React, { useEffect, useState } from 'react';
import { View, Text, ViewProps, TouchableOpacity, TextProps, Image, FlatList, Linking, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import {ATTRACTIONS_MEDIA_URL, TOURISM_API_KEY} from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Dropdown } from '../../common/Dropdown';
import { AttractionsConfig, AttractionsSortConfig } from '../../config/AttractionsConfig';
import { AttractionsAPI } from '../../services/attractions';



const attractionsApi = new AttractionsAPI();
const no_Img = require("../../../assets/BaseApp/No_image_available.png");

const Attractions = () => {

    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [currentItem, setCurrentItem] = useState<string | null>(null);
    const [sortItem, setSortItem] = useState<string | undefined>(undefined);
    const [nextToken, setNextToken] = useState(undefined);
    const [attractionsData, setAttractionsData] = useState<Record<string, any>[]>([]);

    const handleClick = async () => {
        //TODO: Add a loader here
        if (activeItem) {
            try {
                const data = await attractionsApi.getAttractionsDetails({keyword: activeItem, sortBy: sortItem});
                setNextToken(data.nextToken);
                setCurrentItem(activeItem);
                setAttractionsData(() => [...data.data]);
                
                Toast.show({
                    type: "success",
                    text1: "Here you go!"
                })
            } catch (e: any) {
                console.log(e.message);
                Toast.show({
                    type: "error",
                    text1: "Please try again later"
                })
            }           

        } else {
            Toast.show({
                type: "error",
                text1: "Please select a field from the dropdown"
            })

        }  
    };

    const handleContClick = async () => {
            
        if (currentItem) {       
            try {
                const data = await attractionsApi.getAttractionsDetails({keyword: currentItem, sortBy: sortItem, nextToken});
                setNextToken(data.nextToken);   
                setAttractionsData((state) => [...state, ...data.data]);
                
                Toast.show({
                    type: "success",
                    text1: "More results!"
                })
            } catch (e: any) {
                console.log(e.message);
                Toast.show({
                    type: "error",
                    text1: "Please try again later"
                })
            }
        }       
    };


    const renderCardItem = ({ item }: { item: Record<string, any> }) => {

        const cardprops: CardItem = {
            title: item?.name,
            desc: item?.description,
            rating: item?.rating,
            uuid: item?.uuid,
            imgUuid: item?.images?.[0]?.uuid || item?.thumbnails?.[0]?.uuid,
            website: item?.officialWebsite,
        }


        return (
            <AttractionCard item={cardprops} />
        )
    }

    return (
        <>
            <View style={styles.searchContainer as ViewProps}>
                <Dropdown 
                label={"Select from list"} 
                data={AttractionsConfig}
                onSelect={setActiveItem}
                styling={styles.keywordDropdown}
                textInput
                />
                <Dropdown 
                label={"Sort by"} 
                data={AttractionsSortConfig}
                onSelect={setSortItem}
                styling={styles.sortParamDropdown}
                />
                <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleClick}
                >
                    <Text style={styles.submitBtnText as TextProps}>Go</Text>
                </TouchableOpacity>
            </View>

            {attractionsData ?
            <>
            <FlatList
            data={attractionsData}
            renderItem={renderCardItem}
            keyExtractor={(item, index) => index.toString()}
            /> 
            <TouchableOpacity
            style={ContinueListButton.imgContainer as ViewProps}
            onPress={handleContClick}>
                <Image 
                    source={require("../../../assets/BaseApp/plus.png")}
                    resizeMode={"contain"}
                     style={ContinueListButton.img}
                    />
            </TouchableOpacity>
            </>
            :

            <View style={{alignItems: "center", justifyContent: "center", height: "70%"}}>
                <Icon name="rocket" size={80}  />
                <Text>Nothing Found. Try another Search Term</Text>
            </View>}
            
        </>
    )

}
//TODO: Add the handleContButton into the Flatlist
const AttractionCard = ({item}: {item: CardItem}) => {

    const imgUrl = item.imgUuid && `${ATTRACTIONS_MEDIA_URL}/${item.imgUuid}?apikey=${TOURISM_API_KEY}`


    const handleLinkToWebsite = async ({url} : {url: string|undefined}) => {
        if (url) {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("No valid url present");
            }
        } else {
            Alert.alert("No valid url present");
        }
    };

    return (
        <TouchableOpacity
        style={CardStyles.container as ViewProps}
        onPress={() => handleLinkToWebsite({url: item.website})}>    
            <View
            style={CardStyles.imgContainer as ViewProps}>
                {imgUrl ? 
                <Image 
                source={{uri: imgUrl}}
                resizeMode={"contain"}
                style={CardStyles.img}
                /> :
                <Image 
                source={no_Img}
                resizeMode={"contain"}
                style={CardStyles.img}
                />
                }
            </View>
            <View
            style={CardStyles.textContainer as ViewProps}>
                
                <Text style={CardStyles.title as TextProps}>{item.title}</Text>
                <Text style={CardStyles.rating as TextProps}>{item.rating}</Text>
            </View>

        </TouchableOpacity>
    )

}

type CardItem = {
    uuid?: string;
    imgUuid?: string;
    title?: string;
    desc?: string;
    rating?: string;
    website?: string;
}

const CardStyles = {
    container: {
        display: "flex",
        flexDirection: "row",
        margin: 10,
        borderWidth: 1,
        borderRadius: 25,
        padding: 15,
        alignItems: "center"
    },

    imgContainer: {
        flex: 1,
        width: 100,
        height: 100,
        marginRight: 20,
    },
    img: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
        flex: 1,

    },
    title: {
        flex: 2,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18
    },
    rating: {
        flex: 1,
        textAlign: "center",
        fontSize: 14
    }
}

const ContinueListButton = {
    img: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    imgContainer: {
        display: "flex",
        height: 30,
        width: "100%",
        marginTop: 5,
    },

}


const styles = {
    searchContainer: {
        display: "flex",
        flexDirection: "row"

    },
    submitBtn: {
        flex: 1,
        marginTop: 10,
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 50,
        padding: 5
    },
    submitBtnText: {
        textAlign: "center",
    },
    keywordDropdown: {
        container: {
            flex: 7,
        },
        button: {
            borderWidth: 1, 
            marginLeft: 10,
            borderRadius: 15,
            paddingLeft: 15,
            paddingVertical: 5,

        },
        textInput: {
            borderWidth: 1, 
            marginLeft: 10,
            borderRadius: 15,
            paddingLeft: 15,
            paddingVertical: 1,

        },
        indivDropdown: {
            paddingVertical: 5, 
        },
        dropdown: {
            position: 'absolute',
            backgroundColor: '#fec8c1',
            opacity: 0.9,
            borderRadius: 15,
            paddingLeft: 15,
            paddingVertical: 5,
        }
        

    },

    sortParamDropdown: {

        container: {
            flex: 4,
        },
        button: {
            borderWidth: 1, 
            marginLeft: 10,
            borderRadius: 15,
            paddingLeft: 15,
            paddingVertical: 5,
            marginRight: 10,

        },
        indivDropdown: {
            paddingVertical: 5, 
        },
        dropdown: {
            position: 'absolute',
            backgroundColor: '#fec8c1',
            opacity: 0.9,
            borderRadius: 15,
            paddingLeft: 15,
            paddingVertical: 5,
            marginRight: 10,
        }

    }
    
}




export default Attractions;