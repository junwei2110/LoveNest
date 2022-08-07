//TODO: Create RadioButtons for the recurring effect
import React from 'react';
import { View, Text, TouchableOpacity, FlexAlignType } from 'react-native'

type RadioButtonProps = {
    valueArray: string[] | number[];
    value: string | number;
    setValue: (val: any) => void;
    orientation: string;
}

type viewStyles = {
    display: "flex" | "none" | undefined;
    flexDirection: "row" | "column";
    margin?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;

}

type buttonStyles = {
    flex: number;
    borderWidth: number;
    backgroundColor?: string;
    margin?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    borderRadius?: number;
    alignItems?: FlexAlignType;
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" ;
}

type Styles = {
    view: viewStyles;
    button: buttonStyles;
    activeButton: buttonStyles;
}

export const RadioButtonArray = ({valueArray, value, setValue, orientation} : RadioButtonProps) => {


    const styles: Styles = {
        view: {
            display: "flex",
            flexDirection: orientation === "vertical" ? "column" : "row",
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 10
        },
        button: {
            flex: 1,
            borderWidth: 1,
            borderRadius: 25,
            margin: 5,
            alignItems: "center"
        
        },
        activeButton: {
            flex: 1,
            borderWidth: 1,
            backgroundColor: "orange",
            borderRadius: 25,
            margin: 5,
            alignItems: "center"
        }

        
    }
    
    return (
        <View style={styles.view}>
            {valueArray.map((val) => (
                <RadioButton 
                    text={val.toString()}
                    setValue={setValue}
                    style={val === value ? styles.activeButton : styles.button}
                />
            ))}
        </View>
    )

}


const RadioButton = ({text, setValue, style} : {
text: string;
setValue: (val: any) => void;
style: buttonStyles}) => {

    return (
        <TouchableOpacity onPress={() => setValue(text)} style={style}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}