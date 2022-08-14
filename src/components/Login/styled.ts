import styled from 'styled-components/native';

interface LoginViewProps {
    contentContainerStyle: contentContainerProps;
}

interface contentContainerProps {
    flexDirection: string;
    flexGrow: string;
    justifyContent: string;

}

export const LoginView = styled.ScrollView.attrs<LoginViewProps>({
    contentContainerStyle: {
            flexGrow: 1,
            alignItems: 'center',
            flexDirection: 'column',  
        }
})``


export const LoginImage = styled.Image`
    margin: 50px 0 30px 0;
    width: 50px;
    height: 50px;

`;

export const LoginTextInput = styled.TextInput`
    border-width: 1px;
    border-radius: 25px;
    padding: 10px 0 10px 20px;
    width: 80%;
    margin: 15px;
`;

export const LoginButton = styled.TouchableOpacity`
    margin: 30px 0 30px 0;
    border-radius:25px;
    border: 1px;
    padding: 10px;
`

