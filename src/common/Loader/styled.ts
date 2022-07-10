import styled from 'styled-components/native';

export const LoaderView = styled.View<{fullScreen: boolean}>`
    justify-content: center;
    align-items: center;
    ${props => props.fullScreen && `
        width: 100%;
        height: 100%;
    `}

`