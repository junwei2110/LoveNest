import React, { Suspense, useState } from 'react';
import { Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { TabInfo } from '../../models/enum';

const weatherIcon = require("../../../assets/BaseApp/cloud.png");
const attractionIcon = require("../../../assets/BaseApp/ferris-wheel.png");

const WeatherTab = React.lazy(() => import('./WeatherTabInformation'));
const AttractionsTab = React.lazy(() => import('./AttractionsTabInformation'));

const showTabInfo = new Map();
showTabInfo.set(TabInfo.Weather, <WeatherTab />)
showTabInfo.set(TabInfo.Attractions, <AttractionsTab />)

export const TabContainer = () => {

    const [activeTab, setActiveTab] = useState(TabInfo.Weather);

    const renderTab = () => {
        return showTabInfo.get(activeTab)
    }

    const changeTab = (val: TabInfo) => {
        setActiveTab(val)
    }


    return (
        <>
            <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 20,
                marginBottom: 20
            }}>
                <TabIcon src={weatherIcon} title={TabInfo.Weather} handleClick={changeTab} />
                <TabIcon src={attractionIcon} title={TabInfo.Attractions} handleClick={changeTab}/>
            </View>
            <View
            style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginLeft: "5%",
                marginRight: "5%"

            }}
            />
            <Suspense fallback={null}>
                {renderTab()}
            </Suspense>

        </>
    )

}


const TabIcon = ({src, title, handleClick} : {
    src: any;
    title: TabInfo;
    handleClick?: (val: TabInfo) => void;
}) => {

    return (
        <View style={{
            display: "flex"
        }}>
            <TouchableOpacity
            style={{
                borderWidth: 2,
                borderColor: "white",
                borderRadius: 15,
                height: 70,
                width: 70,
                padding: 5
            }}
            onPress={() => handleClick?.(title)}>
                <Image 
                source={src}
                style={{
                    flex: 1,
                    width: undefined,
                    height: undefined
                }}
                />
                
            </TouchableOpacity>
            <Text style={{
                textAlign: "center",
                color: "black",
                marginTop: 5
                
            }}>
                {title}
            </Text>
        </View>

    )
}


export const TabInformation = () => {
    return (
        <View>
            <Text>Show Info here</Text>
        </View>
    )
}