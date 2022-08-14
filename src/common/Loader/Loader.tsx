import React from 'react';
import  { ActivityIndicator, Modal } from "react-native";
import { LoaderView } from "./styled";


interface LoaderProps {
    fullScreen?: boolean;
    screenOpacity?: "opaque" | "translucent" | "transparent";
    loaderColor?: string;
    loaderSize?: "small"|"large";
}


export const Loader = ({
    fullScreen=true,
    screenOpacity="translucent",
    loaderColor="#0000ff",
    loaderSize="large"
    }: LoaderProps) => (
        
        <LoaderView fullScreen={fullScreen} screenOpacity={screenOpacity}>
            <ActivityIndicator size={loaderSize} color={loaderColor} />
        </LoaderView>

)



