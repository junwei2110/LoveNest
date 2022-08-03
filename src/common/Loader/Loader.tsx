import React from 'react';
import  { ActivityIndicator } from "react-native";
import { LoaderView } from "./styled";


interface LoaderProps {
    fullScreen?: boolean;
    loaderColor?: string;
    loaderSize?: "small"|"large";
}


export const Loader = ({
    fullScreen=true,
    loaderColor="#0000ff",
    loaderSize="large"
    }: LoaderProps) => (
        
        <LoaderView fullScreen={fullScreen}>
            <ActivityIndicator size={loaderSize} color={loaderColor} />
        </LoaderView>

)