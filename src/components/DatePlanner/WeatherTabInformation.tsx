import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewProps } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; //TODO: For IOS
import Toast from 'react-native-toast-message'

import { SGRegionsCoordinates, SingaporeFullMap } from '../../config/WeatherConfig';
import { WeatherForecastAPI } from '../../services/weather';
import { mapStyle } from './mapStyle';

const styles = StyleSheet.create({
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginRight: 5,
        marginBottom: 5,
        marginTop: 5,
    },
    mapTitle: {
        marginRight: 5,
    },
    refreshBtn: {
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "#fe9c8f",
    },
    refreshBtnText: {
        fontWeight: "bold"
    },
    mapContainer: {
      height: "40%",      
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    marker: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: "#007bff",
        borderColor: "#eee",
        borderRadius: 5,
        elevation: 10,
      },
    text: {
      color: "#fff",   
    },
    indicatorContainer: {
        height: "30%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
});

const stylesTemperature = {
    Container: {
        position: "relative",
        width: "35%"

    },
    temperatureTextHot: {
        position: "absolute",
        top: "5%",
        left: "0%",
        fontWeight: "bold",
        fontSize: 25,
        color: "red"
    },
    temperatureTextCold: {
        position: "absolute",
        bottom: "5%",
        right: "0%",
        fontWeight: "bold",
        fontSize: 25,
        color: "blue"
    },
    windText: {
        top: "-5%",
        fontWeight: "bold",
        fontSize: 25,
        textAlign: "center"
    },
    img: {
        flex: 1,
        height: undefined,
        width: undefined
    }

}

const weatherAPI = new WeatherForecastAPI(new Date());
const tempImg = require("../../../assets/BaseApp/temperatures.png");
const windImg = require("../../../assets/BaseApp/wind.png");

function CustomMarker({text} : {text?: string}) {
    return (
      <View style={styles.marker}>
        <Text style={styles.text}>{text ? text : "NA"}</Text>
      </View>
    );
}

const TemperatureIcon = ({coldTemp, hotTemp} : {coldTemp?: string; hotTemp?: string;}) => {

    return (
        <View style={stylesTemperature.Container as ViewProps}>
            <Image 
            source={tempImg}
            resizeMode={"contain"}
            style={stylesTemperature.img}
            />
            <Text style={stylesTemperature.temperatureTextHot as ViewProps}>{hotTemp ? hotTemp : "NA"}°C</Text>
            <Text style={stylesTemperature.temperatureTextCold as ViewProps}>{coldTemp ? coldTemp : "NA"}°C</Text>
        </View>
    )
}

const WindIcon = ({lowSpeed, highSpeed} : {lowSpeed?: string; highSpeed?: string;}) => {

    return (
        <View style={stylesTemperature.Container as ViewProps}>
            <Image 
            source={windImg}
            resizeMode={"contain"}
            style={stylesTemperature.img}
            />           
            <Text 
            style={stylesTemperature.windText as ViewProps}
            numberOfLines={1}>
                {(lowSpeed && highSpeed) ?
                `${lowSpeed} - ${highSpeed} km/h` : "Data Unavailable"}
            </Text>
        </View>
    )
}


const WeatherTabInformation = () => {

    const [weatherData, setWeatherData] = useState<Record<string, any>>({});
    const [sgRegions, setSGRegions] = useState<string[]>([]);
    const [refresh, setRefresh] = useState(true);

    

    useEffect(() => {

        const weatherDataRetrieval = async () => {
            try{
                const data = await weatherAPI.fetchWeatherForecast();
                setWeatherData(data);
                setSGRegions(Object.keys(data?.items?.[0]?.periods?.[0]?.regions))
                setRefresh(false);
                Toast.hide();
                Toast.show({
                    type: "success",
                    text1: "Weather Data Refreshed"
                })
            } catch (e: any) {
                Alert.alert(e.message);
                Toast.hide();
                Toast.show({
                    type: "error",
                    text1: "Please try again later"
                })
            }
            
        };
        refresh && weatherDataRetrieval();
    }, [refresh])

    const handleRefresh = () => {
        setRefresh(true);

    }

    return (
        <>
        <View style={styles.titleContainer}>
            <Text style={styles.mapTitle}>24 Hr Forecast</Text>
                <TouchableOpacity 
                    style={styles.refreshBtn}
                    onPress={handleRefresh}
                    >
                    <Text style={styles.refreshBtnText}>Refresh</Text>
                </TouchableOpacity>
        </View>
        <View style={styles.mapContainer}>
            <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            customMapStyle={mapStyle}
            scrollEnabled={false}
            rotateEnabled={false}
            zoomEnabled={false}
            zoomTapEnabled={false}
            region={{
                latitude: SingaporeFullMap.latitude,
                longitude: SingaporeFullMap.longitude,
                latitudeDelta: SingaporeFullMap.latLonggDelta,
                longitudeDelta: SingaporeFullMap.latLonggDelta,
            }}
            >
                {sgRegions.length ? sgRegions.map((region: string, id) => (
                    <Marker key={id} coordinate={SGRegionsCoordinates?.[region]}>
                        <CustomMarker text={weatherData?.items?.[0]?.periods?.[0]?.regions?.[region]} />
                    </Marker>
                )): null}     
            </MapView>
        </View>
        <View style={styles.indicatorContainer}>
            <TemperatureIcon
            hotTemp={weatherData?.items?.[0]?.general?.temperature?.high}
            coldTemp={weatherData?.items?.[0]?.general?.temperature?.low}
            />
            <WindIcon 
            lowSpeed={weatherData?.items?.[0]?.general?.wind?.speed?.low}
            highSpeed={weatherData?.items?.[0]?.general?.wind?.speed?.high}
            />
        </View>
      </>
    )
}

export default WeatherTabInformation;