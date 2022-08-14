import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';



export const CustomButton = ({
    shape,
    size, 
    color, 
    handlePress,
    styleContainer
}: {shape: shape; size: number; color: string; handlePress: () => void; styleContainer: styleContainer}) => {

    const styles: StyleProps = {
        container: {
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center'
        },
    
        circle: {
            width: size,
            borderBottomColor: `${color}`,
            borderBottomWidth: size,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderTopWidth: 0,
            borderRadius: 25,
    
        },

        cross: { 
            width: size-10,
            height: size-10,
            minWidth: 5,
            minHeight: 5,
        }
    }

    const layoutProps: LayoutProps = {
        container: {
          position: 'relative'
        },

        cross: {
            position: 'absolute',
            
        }
    }


    let styleShape;
    let styleFunction;
    let layoutStyle;
    if (shape === "circle") {
        styleShape = styles.circle;
        styleFunction = styles.cross;
        layoutStyle = layoutProps.cross
    }

    return (
        <TouchableOpacity onPress={handlePress} style={styleContainer}>
            <View style={[layoutProps.container, styles.container]}>
                <View style={styleShape} />
                <Image source={require("../../../assets/BaseApp/close.png")} style={[layoutStyle, styleFunction]} />
            </View>
        </TouchableOpacity>
    )


}

type shape = "circle";
type position = "absolute" | "relative" | undefined

type LayoutProps = {
    container: {
        position: position
    };

    cross: {
        position: position;
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }
}

type styleContainer = {
    [key: string]: unknown
}

type container = {
    alignItems: 'center';
    justifyContent: 'center';
    [key: string]: any;
}

type StyleProps = {
    container: container;
    [key: string]: any;
}