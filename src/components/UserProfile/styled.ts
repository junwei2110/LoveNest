import styled from 'styled-components/native';

export const SetUpProfilePicView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    height: 35%;
`

export const ImageBox = styled.TouchableOpacity`
    flex: 1;
    height: 50%;
    display: flex;
    margin-left: 3%;
    background-color: white;
    opacity: 0.7;
`

export const ImageBox2 = styled.TouchableOpacity`
    flex: 3;
    justify-content: center;
    display: flex;

`

export const ProfilePic = styled.Image`
    flex: 1;
    width: undefined;
    height: undefined;
`

export const ImageResize = styled.Image`
    flex: 1;
    width: undefined;
    height: undefined;
`

export const ProfilePicUpdateBox = styled.View`
    border-width: 0px;
    margin-right: 3%;
    padding: 0 5%;
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`

export const ModalView = styled.View`
    margin: 25% 5%;
    background-color: white;
    height: 75%;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    border-width:5px;
`


export const ModalInternalView = styled.View`
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;

`

export const DateSpanView = styled.View`
    display: flex;
    flex-direction: row;
    margin: 10% 5%;

`

export const DateTabTitle = styled.View`
    align-items: center;
    margin-top: 20%;

`

export const DateTitleView = styled.View`
    flex: 5;
    justify-content: center;
`

export const DateButtonView = styled.View`
    flex: 2;
    justify-content: center;
`


export const ModalDate = styled.View`
    margin-top: 10%;
    margin-bottom: 20%;
    background-color: transparent;
`


export const TabTextInput = styled.TextInput`
    border-width: 1px;
    border-radius: 15px;
    margin-top: 20%;
    margin-bottom: 5%;
    width: 80%;
    text-align: center;
`

export const DateTextInput = styled.TextInput`
    border-width: 1px;
    border-radius: 15px;
    width: 90%;
    text-align: center;
`


export const CameraView = styled.View`
    height: 100%;
`

export const CameraBottomView = styled.View`
    position: absolute;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    height: 15%;
    width: 100%;
    top: 85%;
    background-color: hsla(0, 0%, 0%, 0.3);    
`

export const CameraButtonView = styled.View`
    flex: 9;
    border-width: 0px;
    margin-right: 2%;
    padding: 0 5%;

`


export const CameraButton = styled.TouchableHighlight`
    border-radius: 15px;
    background-color: white;
    border-width: 3px;
    align-items: center;
    justify-content: center;
    height: 30%;
`

export const CloseView = styled.View`
    position: absolute;
    justify-content: center;
    height: 5%;
    width: 100%;
    background-color: hsla(0, 0%, 0%, 0.3);  
`

type CloseButtonProps = {
    small?: boolean;
}

export const CloseButton = styled.Image<CloseButtonProps>`
    height: ${props => props.small ? "15px" : "25px"};
    width: ${props => props.small ? "15px" : "25px"};
    margin-left: 15px;
    margin-top: ${props => props.small ? "10px" : 0};
    
`

export const DateAdditionButton = styled.TouchableOpacity`
    display: flex;
    height: 30px;
    margin: 5% 0;
`

export const ImportantDatesView = styled.ScrollView.attrs({
    contentContainerStyle: {
            flexGrow: 1,
            flexDirection: 'column',  
        }
})``

export const ConfirmationModalOverallView = styled.View`
    margin: 25% 5%;
    background-color: white;
    height: 75%;
    border-radius: 10px;
    border-width: 3px;
    
`


export const ConfirmationModalView = styled.ScrollView.attrs({
    contentContainerStyle: {
            flexGrow: 1,
            flexDirection: 'column', 
            
        }
})``


export const ConfirmationText = styled.TextInput`
    border-width: 1px;
    width: 80%;
    border-radius: 20px;
    text-align: center;
`
export const ConfirmationTextView = styled.View`
    width: 100%;
    align-items: center;
    
`