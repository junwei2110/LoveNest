import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, TouchableOpacity, Image } from 'react-native';
import { imageSlideShowConfig, ImageStackParamList } from "../../config/ImageSlideShow";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';



export const ImageAnimation = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [imgSrc, setImgSrc] = useState(0);
    const navigation = useNavigation<NativeStackNavigationProp<ImageStackParamList>>();


    const handleOnClick = () => {
        navigation.navigate(imageSlideShowConfig[imgSrc].link)
    }

    const animateSlideShow = () => {
        Animated.sequence([
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }
            ),
            Animated.timing(
                fadeAnim,
                {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }
            )
        ]).start(() => {
                let newImgSrc = imgSrc + 1;
                if (newImgSrc >= imageSlideShowConfig.length) {
                    newImgSrc = 0
                };
                setImgSrc(newImgSrc);
            });
    }

    useEffect(() => {
        animateSlideShow();
    }, [imgSrc]);

    return (
        
        <TouchableOpacity
        onPress={handleOnClick} 
        style={{
            height: "35%",
            //backgroundColor: "#fec8c1",
            justifyContent: "center"
            }}>
            <View style={{
                height: "90%",
                }}> 
                <Animated.Image 
                source={imageSlideShowConfig[imgSrc].src} 
                resizeMode={"contain"}
                style={{
                    flex: 1,
                    height: undefined,
                    width: undefined,
                    opacity: fadeAnim,
                    
                }}
                    />
                <Animated.Text 
                style={{
                    opacity: fadeAnim,
                    textAlign: "center",
                    position: "absolute",
                    top: "82%",
                    right: "2%",
                    backgroundColor: "white",
                    borderRadius: 30,
                    width: "35%",
                    padding: 5,
                }}>
                    {imageSlideShowConfig[imgSrc].description}
                </Animated.Text>
            </View>
        </TouchableOpacity>
        

    )


}

