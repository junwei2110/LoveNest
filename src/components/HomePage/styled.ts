import styled, { css } from 'styled-components/native';


export const EventsView = styled.ScrollView.attrs({
    contentContainerStyle: {
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'center',
                 
        },
    margin: 10,

})``

export const EventModalView = styled.View`
    align-items: center;
`

export const EventModalTextInput = styled.TextInput`
    border-width: 1px;
    width: 90%;
    text-align: center;
    margin: 2% 5%;
    border-radius: 15px;
`

type FlexBoxProps = {
    flexRatio?: number;
    noBorder?: boolean;
    last?: boolean;
    centered?: boolean;
}



export const FlexBox = styled.TouchableOpacity<FlexBoxProps>`
    ${props => props.centered && "align-items: center"};
    justify-content: center;
    flex: ${props => props.flexRatio};
    margin-right: ${props => props.last ? 0 : "5%"};
    
`
export const TextBox = styled.Text<FlexBoxProps>`
    border-width: ${props => props.noBorder ? 0 : 1};
    text-align: center;
    vertical-align: center;
    border-radius: 15px;
    width: 100%;
    margin-top: 5px; 
    padding: 15px;   

`
export const ReminderChecklist = styled.ScrollView.attrs({
    contentContainerStyle: {
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'center',
                 
        },
    height: "40%",
    marginBottom: "2%",
    width: "100%"
})``


export const ChecklistFlexBox = styled.TouchableOpacity`
    display: flex;
    height: 30px;
    width: 100%;
    margin-top: 10px;
`

export const ResizeImage = styled.Image`
    flex: 1;
    width: undefined;
    height: undefined;

`

/* Unable to use dynamic props for react native; only application for react

export const EventModalSpanInner = styled.TextInput`
    border-width: 1px;    
`

const dynamicFlexRatio = ({flexRatioArray} : {
    flexRatioArray: number[]
}) => {

    let styles = "";

    flexRatioArray.map((flexRatio, idx) => {
         styles += `
            ${EventModalSpanInner}{
                flex: ${flexRatio};
            }
         `
    })
    return css`${styles}`

}


type SpanProps = {
    flexRatioArray?: number[];
}

export const EventModalSpanView = styled.View<SpanProps>`
    display: flex;
    flex-direction: row;
    margin: 5%;
    ${props => props.flexRatioArray && 
        dynamicFlexRatio({flexRatioArray: props.flexRatioArray})}

`

*/

