import React, { useState } from 'react';
import { Text, Button, View, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import DatePicker from 'react-native-date-picker';
import Parse from "parse/react-native.js";


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
import { RadioButtonArray } from '../../common/RadioButtons';

export type ProfileInputs = {
    name: string;
    partnerEmail: string;
    partnerId?: string;
    bdate: DateObj;
    annidate: DateObj;
    importantDates?: DateObj[];
}

type recurrence = "Once"| "One-Time" | "Week" | "Month" | "Annual";

export type DateObj = {
    title?: string;
    createdAt: Date;
    date?: Date;
    recurrence?: recurrence;
}

export const SetUpProfileTabs = () => {

    const navigation = useNavigation();
    const [bdate, setBirthDate] = useState<DateObj>({
        title: "Birthday",
        createdAt: new Date(),
        recurrence: "Annual"
    });
    const [annidate, setAnniDate] = useState<DateObj>({
        title: "Anniversary",
        createdAt: new Date(),
        recurrence: "Annual"
    });;
    const [name, setName] = useState("");
    const [partnerEmail, setpartnerEmail] = useState("");
    const [partnerId, setpartnerId] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [importantDates, setImportantDates] = useState<DateObj[]>([]);


    const partnerIdChecker = async () => {
        const partnerIdQuery = new Parse.Query(Parse.User);
        partnerIdQuery.contains('email', partnerEmail);
        const partnerIdQueryResult = await partnerIdQuery.find();
        if (partnerIdQueryResult.length > 0) {
            //TODO: An additional check to see if he alr has a partner 
            setpartnerId(partnerIdQueryResult[0].id);
            Alert.alert('Partner Found!');            
        } else {
            Alert.alert('Partner Not Found! Please check again');  
        }

    };

    return (
        <>
            <ConfirmProfileInput
            modalVisible={modalVisible}
            handleModal={() => setModalVisible(false)} 
            profileInputs={{
                name: name,
                partnerEmail: partnerEmail,
                partnerId: partnerId,
                bdate: bdate,
                annidate: annidate,
                importantDates: importantDates
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
                checker={partnerIdChecker}
                />
                <DateTab 
                dateArray={importantDates} 
                setDateArray={setImportantDates}
                bdate={bdate}
                annidate={annidate}
                setBirthDate={setBirthDate}
                setAnniDate={setAnniDate}
                end={true}
                handleModal={() => setModalVisible(true)}
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

const TextTab = ({text, handleChange, checker, end, handleModal}: {
    text: string;
    handleChange: (val: string) => void;
    checker?: () => void;
    end?: boolean;
    handleModal?: (val: boolean) => void;
}) => {
    return(
        <ModalInternalView>
            <Text>{text}</Text>
            <TabTextInput 
            placeholder='You can always change it later'
            onChangeText={text => handleChange(text)}
            autoCapitalize={"none"}
            />
            {checker &&
                <Button
                title={"Check"} 
                onPress={checker}
                />
            }
            {end && handleModal &&
                <Button
                title={"Confirm"} 
                onPress={() => handleModal(true)}
                />
            }
        </ModalInternalView>
    )
};


const DateTab = ({dateArray, setDateArray, bdate, annidate, setBirthDate, setAnniDate, end, handleModal}:{
    dateArray: DateObj[];
    setDateArray: React.Dispatch<React.SetStateAction<DateObj[]>>;
    bdate: DateObj;
    annidate: DateObj;
    setBirthDate: React.Dispatch<React.SetStateAction<DateObj>>;
    setAnniDate: React.Dispatch<React.SetStateAction<DateObj>>;
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
            recurrence: "Once"
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
            <DateTabComponent 
                text={"Your Birthday!"} 
                optional={false}
                singleDate={bdate}
                setDate={setBirthDate}  />
            <DateTabComponent 
                text={"Your Anniversary!"} 
                optional={false} 
                singleDate={annidate}
                setDate={setAnniDate}/>
            {dateArray && dateArray.map((val, idx) => (
                <DateTabComponent
                    key={val.createdAt.toISOString()}
                    index={idx+1} 
                    dateArray={dateArray}
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


const DateTabComponent = ({index, text, dateArray, setDateArray, singleDate, setDate, optional, handleRemove}:{
    index?: number;
    text?: string;
    dateArray?: DateObj[]; 
    setDateArray?: React.Dispatch<React.SetStateAction<DateObj[]>>;
    singleDate?: DateObj;
    setDate?: React.Dispatch<React.SetStateAction<DateObj>>;
    optional: boolean;
    handleRemove?: (idx: number) => void;
}) => {

    const [open, setOpen] = useState(false);
    const [initSetDate, setInitSetDate] = useState(false);

    let date;
    let title;
    let recurrence;
    if (dateArray && index) {
        date = dateArray[index-1].date;
        title = dateArray[index-1].title;
        recurrence = dateArray[index-1].recurrence;
    } else if (singleDate) {
        date = singleDate.date
        title = singleDate.title;
    }
    console.log("Date Tab Component");

    const handleDateConfirm = (dateInput : Date) => {
        setInitSetDate(true);
        setOpen(false);
        if (dateArray && setDateArray && index) {
            const arrayOfDates = dateArray;
            arrayOfDates[index-1].date = dateInput;
            console.log(arrayOfDates);
            setDateArray(() => [...arrayOfDates]); 
        } else if (singleDate && setDate) {
            const newSingleDate = singleDate;
            newSingleDate.date = dateInput;
            setDate(() => ({...newSingleDate}));
        }

    }

    const handleTextChange = (text : string) => {

        if (dateArray && setDateArray && index) {
            const arrayOfDates = dateArray;
            arrayOfDates[index-1].title = text;
            console.log(arrayOfDates);
            setDateArray(() => [...arrayOfDates]); 

        } else if (singleDate && setDate) {
            const newSingleDate = singleDate;
            newSingleDate.title = text;
            setDate(() => ({...newSingleDate}));
        }        

    }

    const handleRecurrenceChange = (text : recurrence) => {

        if (dateArray && setDateArray && index) {
            const arrayOfDates = dateArray;
            arrayOfDates[index-1].recurrence = text;
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
                onConfirm={(dateInput) => {handleDateConfirm(dateInput)}}
                onCancel={() => {setOpen(false)}}
            />
            {optional &&
            <TouchableOpacity onPress={handleRemoval} >
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
                    {!initSetDate && 
                    <Button
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
            {optional && recurrence && 
            <RadioButtonArray 
            valueArray={["Once", "Week", "Month", "Annual"]}
            value={recurrence}
            setValue={handleRecurrenceChange}
            orientation={"horizontal"}
            />}
            <View
                style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
            }}
/>
        </> 
    )



}
