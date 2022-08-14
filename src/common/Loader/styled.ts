import styled from 'styled-components/native';

type LoaderViewProps = {
    fullScreen: boolean;
    screenOpacity?: "opaque" | "translucent" | "transparent"; 
}

export const LoaderView = styled.View<LoaderViewProps>`
    justify-content: center;
    align-items: center;
    background-color: ${props => props.screenOpacity && 
        props.screenOpacity === "translucent" ? "rgba(23,39,51,0.6)" : 
        props.screenOpacity === "transparent" ? "rgba(23,39,51,0)" : "rgba(23,39,51,1)"};
    ${props => props.fullScreen && `
        width: 100%;
        height: 100%;
    `};

`
