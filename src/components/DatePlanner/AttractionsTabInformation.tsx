import React, { useEffect, useState } from 'react';
import { View, Text, ViewProps, TouchableOpacity, TextProps, Image, FlatList } from 'react-native';
import Toast from 'react-native-toast-message';
import {ATTRACTIONS_MEDIA_URL, TOURISM_API_KEY} from 'react-native-dotenv';

import { Dropdown } from '../../common/Dropdown';
import { AttractionsConfig, AttractionsSortConfig } from '../../config/AttractionsConfig';
import { AttractionsAPI } from '../../services/attractions';



const attractionsApi = new AttractionsAPI();

const Attractions = () => {

    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [sortItem, setSortItem] = useState<string | undefined>(undefined);
    const [attractionsData, setAttractionsData] = useState<Record<string, any> | null>(null);

    const handleClick = async () => {
        //TODO: Add a loader here
        if (activeItem) {
            try {
                const data = await attractionsApi.getAttractionsDetails({keyword: activeItem, sortBy: sortItem});
                setAttractionsData(data);
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

    const renderCardItem = ({ item }: { item: Record<string, any> }) => {

        const cardprops: CardItem = {
            title: item?.name,
            desc: item?.description,
            rating: item?.rating,
            uuid: item?.uuid,
            imgUuid: item?.images?.[0]?.uuid || item?.thumbnails?.[0]?.uuid
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

            {attractionsData?.data ?
            <FlatList
            data={attractionsData.data}
            renderItem={renderCardItem}
            keyExtractor={(item, index) => index.toString()}
            /> :
            <Text>Nothing Found. Try another Search Term</Text>}
            
        </>
    )

}

const AttractionCard = ({item}: {item: CardItem}) => {

    const imgUrl = `${ATTRACTIONS_MEDIA_URL}/${item.imgUuid}?apikey=${TOURISM_API_KEY}`

    return (
        <TouchableOpacity
        style={CardStyles.container as ViewProps}>    
            <View
            style={CardStyles.imgContainer as ViewProps}>
                <Image 
                source={{uri: imgUrl}}
                resizeMode={"contain"}
                style={CardStyles.img}
                />
            </View>
            <View
            style={CardStyles.textContainer as ViewProps}>
                
                <Text style={CardStyles.title}>{item.title}</Text>
                <Text style={CardStyles.rating}>{item.rating}</Text>
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
}

const CardStyles = {
    container: {
        display: "flex",
        flexDirection: "row",
        margin: 10,
        borderWidth: 1,
        borderRadius: 25,
        padding: 15,
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
        height: undefined
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