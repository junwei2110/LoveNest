import React, { useState, useRef } from 'react';
import { Text, Button, View, TextInput, Modal, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import DatePicker from 'react-native-date-picker';


import { 
    TabTextInput, 
    ModalInternalView,
    DateTextInput,
    DateSpanView,
    DateTitleView,
    DateButtonView,
    DateTabTitle, 
    ModalDate, 
    ModalView,
    CloseView,
    CloseButton,
    DateAdditionButton,
    ImageResize,
    ImportantDatesView,
} from './styled';
import { ConfirmProfileInput } from './ConfirmProfileInput';

export type ProfileInputs = {
    name: string;
    partnerEmail: string;
    bdate: string;
    annidate: string;
}

type DateObj = {
    title: string;
    createdAt: Date;
    date: Date;
}

export const SetUpProfileTabs = () => {

    const navigation = useNavigation();
    const [bdate, setBirthDate] = useState(new Date());
    const [annidate, setAnniDate] = useState(new Date());
    const [name, setName] = useState("");
    const [partnerEmail, setpartnerEmail] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [importantDates, setImportantDates] = useState<DateObj[]>([]);

    console.log("Parent");
    return (
        <>
            <ConfirmProfileInput
            modalVisible={modalVisible}
            handleModal={() => setModalVisible(false)} 
            profileInputs={{
                name: name,
                partnerEmail: partnerEmail,
                bdate: bdate.toDateString(),
                annidate: annidate.toDateString()
            }}
            />
            
            <Swiper loop={false}>
                <TextTab
                text={"Give us your Name (nickname is fine too!)"} 
                handleChange={setName}
                />
                <TextTab
                text={"What is your Partner's Email Address?"}  
                handleChange={setpartnerEmail}
                />
                <DateTab 
                dateArray={importantDates} 
                setDateArray={setImportantDates}
                end={true}
                handleModal={() => console.log("hello")}
                />
            </Swiper>
            <CloseView>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <CloseButton 
                    source={require("../../../assets/BaseApp/close.png")} 
                    />
                </TouchableOpacity>  
            </CloseView>
        </>

    )
}

const TextTab = ({text, handleChange, end, handleModal}: {
    text: string;
    handleChange: (val: string) => void;
    end?: boolean;
    handleModal?: (val: boolean) => void;
}) => {
    return(
        <ModalInternalView>
            <Text>{text}</Text>
            <TabTextInput 
            placeholder='You can always change it later'
            onChangeText={text => handleChange(text)}
            />
            {end && handleModal &&
                <Button
                title={"Confirm"} 
                onPress={() => handleModal(true)}
                />
            }
        </ModalInternalView>
    )
};


const DateTab = ({dateArray, setDateArray, end, handleModal}:{
    dateArray: DateObj[];
    setDateArray: React.Dispatch<React.SetStateAction<DateObj[]>>;
    end?: boolean;
    handleModal?: (val: boolean) => void;
}) => {


    const handleAddNewDate = () => {
        console.log("Date added!")
        const arrayOfDates = dateArray;
        console.log(arrayOfDates);
        arrayOfDates.push({
            title: "",
            createdAt: new Date(),
            date: new Date()
        });
        console.log(arrayOfDates);
        setDateArray(() => [...arrayOfDates]);
        
    }

    const handleRemoveDate = (idx: number) => {
        console.log("Date removed!");
        const arrayOfDates = dateArray;
        console.log(arrayOfDates);
        arrayOfDates.splice(idx, 1);
        console.log(arrayOfDates);
        setDateArray(() => [...arrayOfDates]);
        
    }

    console.log("Date Tab");
    return(
        <ImportantDatesView>
            <DateTabTitle>
                <Text>Set your Important Dates here!</Text>
            </DateTabTitle>
            <DateTabComponent text={"Your Birthday!"} optional={false}  />
            <DateTabComponent text={"Your Anniversary!"} optional={false} />
            {dateArray && dateArray.map((val, idx) => (
                <DateTabComponent
                    key={val.createdAt.toISOString()}
                    index={idx+1} 
                    dateValue={dateArray}
                    setDateArray={setDateArray}
                    optional={true}
                    handleRemove={handleRemoveDate} />
            ))}
            <DateAdditionButton onPress={handleAddNewDate}>
                <ImageResize 
                    source={require("../../../assets/BaseApp/plus.png")}
                    resizeMode={"contain"}
                    />
            </DateAdditionButton >
            {end && handleModal &&
                <Button
                title={"Confirm"} 
                onPress={() => handleModal(true)}
                />
            }  
        </ImportantDatesView> 
        
    )
};


const DateTabComponent = ({index, text, dateValue, setDateArray, optional, handleRemove}:{
    index?: number;
    text?: string;
    dateValue?: DateObj[]; 
    setDateArray?: React.Dispatch<React.SetStateAction<DateObj[]>>;
    optional: boolean;
    handleRemove?: (idx: number) => void;
}) => {

    const [open, setOpen] = useState(false);
    const [initSetDate, setInitSetDate] = useState(false);

    console.log("Datetabcomponent", dateValue);
    console.log("Datetabcomponent", initSetDate);
    const date = index && dateValue && dateValue[index-1].date;
    const title = index && dateValue && dateValue[index-1].title;
    console.log("Date Tab Component");

    const handleConfirm = (dateInput : Date) => {
        setInitSetDate(true);
        setOpen(false)
        console.log("outside functin");
        if (dateValue && setDateArray && index) {
            console.log("Hello within function");
            const arrayOfDates = dateValue;
            arrayOfDates[index-1].date = dateInput;
            console.log(arrayOfDates);
            setDateArray(() => [...arrayOfDates]); 
        }

    }

    const handleTextChange = (text : string) => {
        if (dateValue && setDateArray && index) {
            console.log("Hello within function");
            const arrayOfDates = dateValue;
            arrayOfDates[index-1].title = text;
            console.log(arrayOfDates);
            setDateArray(() => [...arrayOfDates]); 
        }

    }

    const handleRemoval = () => {
        if (index && handleRemove) {
            handleRemove(index-1);
        }
    }

    return(
        <>
            <DatePicker
                modal
                mode={"date"}
                open={open}
                date={date || new Date()}
                onConfirm={(dateInput) => {handleConfirm(dateInput)}}
                onCancel={() => {setOpen(false)}}
            />
            {optional &&
            <TouchableOpacity onPress={handleRemoval}>
                <CloseButton
                    small 
                    source={require("../../../assets/BaseApp/close.png")} 
                    />
            </TouchableOpacity>}
            <DateSpanView>
                <DateTitleView>
                    {text && 
                    <Text>{text}</Text>}
                    {!text &&
                    <DateTextInput 
                        placeholder={"Event Title"} 
                        onChangeText={(text) => handleTextChange(text)}
                        value={title || ""} 
                        
                        />}
                </DateTitleView>
                <DateButtonView>
                    {!initSetDate && <Button
                    title={"Set Date"}
                    onPress={() => setOpen(true)}
                    />}
                    {initSetDate && date && 
                    <Button
                    title={date.toDateString()}
                    onPress={() => setOpen(true)}
                    />}
                </DateButtonView>
            </DateSpanView>
            <View
                style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
            }}
/>
        </> 
    )



}
