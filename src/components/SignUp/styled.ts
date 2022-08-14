import styled from 'styled-components/native';

interface SignUpViewProps {
    contentContainerStyle: contentContainerProps;
}

interface contentContainerProps {
    flexDirection: string;
    flexGrow: string;
    justifyContent: string;

}

export const SignUpView = styled.ScrollView.attrs<SignUpViewProps>({
    contentContainerStyle: {
            flexGrow: 1,
            alignItems: 'center',
            flexDirection: 'column',  
        }
})``

export const SignUpImage = styled.Image`
    margin: 50px 0 30px 0;
    width: 50px;
    height: 50px;

`;

export const SignUpTextInput = styled.TextInput`
    width: 80%;
    border-radius: 25px;
    margin: 15px;
    border-width: 1px;
    padding: 10px 0 10px 20px;
`

export const SignUpButton = styled.TouchableOpacity`
    margin: 30px 0 30px 0;
    border-radius: 25px;
    border: 1px;
    padding: 10px;
`
