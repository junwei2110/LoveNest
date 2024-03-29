import React, { useContext, useState } from 'react';
import { Text, Button, View, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import DatePicker from 'react-native-date-picker';
import Parse from "parse/react-native.js";
import Toast from 'react-native-toast-message';
import messaging from "@react-native-firebase/messaging";


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
import { Store } from '../../data';
import { userLoggingInit, userLoggingEnd } from '../../data/actions';

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

type RouteSetUpTab = {
    params: {
        updatePartner: boolean;
    }
}

export const SetUpProfileTabs = () => {

    const navigation = useNavigation();
    const route = useRoute<RouteProp<RouteSetUpTab>>();
    const { updatePartner } = route.params;

    const [globalState, dispatch] = useContext(Store);
    const { currentUser } = globalState;

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
    const [modalVisible, setModalVisible] = useState(false);
    const [importantDates, setImportantDates] = useState<DateObj[]>([]);
    const [partnerObj, setPartnerObj] = useState<Parse.Attributes | null>(null);

    const partnerIdChecker = async () => {
        const partnerIdQuery = new Parse.Query(Parse.User);
        partnerIdQuery.contains('email', partnerEmail);
        dispatch(userLoggingInit());

        try {
            const partnerIdQueryResult = await partnerIdQuery.first();
            if (partnerIdQueryResult) {
                if (partnerIdQueryResult.get("coupleId") === partnerIdQueryResult.id && !partnerIdQueryResult.get("partnerId")) {
                    setPartnerObj(partnerIdQueryResult);
                    Toast.show({
                        type: "success",
                        text1: "Partner found!"
                    })
                } else {
                    Toast.show({
                        type: "error",
                        text1: "Your Partner is already attached"
                    })
                }
                
                dispatch(userLoggingEnd());           
            } else {
                Toast.show({
                    type: "error",
                    text1: "Partner not found"
                })
                dispatch(userLoggingEnd());  
            }

        } catch(e: any) {
            Alert.alert(e.message);
        }

    };

    const partnerIdCheckerAndUpdate = async () => {
        const deviceToken = await messaging().getToken();
        dispatch(userLoggingInit());
            try {
                const result = await Parse.Cloud.run("sendPartnerRequest", {
                    partnerEmail,
                    userId: currentUser?.id,
                    deviceToken
                });
                console.log(result, "result of the partnerId Checker")

                switch (result) {
                    case "Not Found":
                        Toast.show({
                            type: "error",
                            text1: "Partner not found"
                        })
                        break;
                    case "Your Partner is already attached":
                        Toast.show({
                            type: "error",
                            text1: "Your Partner is already attached"
                        })
                        break;
                    case "Request Sent":
                        Toast.show({
                            type: "success",
                            text1: "Request Sent Successfully"
                        })
                        currentUser?.set("partnerId", "pending");
                        break;

                }
                dispatch(userLoggingEnd()); 
                navigation.goBack();

            } catch(e: any) {
                Toast.show({
                    type: "error",
                    text1: "Failed to Update"
                })
                dispatch(userLoggingEnd()); 
                navigation.goBack();
            }
            
    };

    return (
        <>
        {!updatePartner ?
            <> 
                <ConfirmProfileInput
                modalVisible={modalVisible}
                handleModal={() => setModalVisible(false)} 
                profileInputs={{
                    name: name,
                    partnerEmail: partnerEmail,
                    bdate: bdate,
                    annidate: annidate,
                    importantDates: importantDates
                }}
                partnerObj={partnerObj}
                />
                
                <Swiper loop={false}>
                    <TextTab
                    text={"Give us your Name (nickname is fine too!)"} 
                    handleChange={setName}
                    />
                    {!currentUser?.get("partnerId") ? 
                    <TextTab
                    text={"What is your Partner's Email Address?"}  
                    handleChange={setpartnerEmail}
                    checker={partnerIdChecker}
                    /> : null}
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
            
            :

            <>
                <TextTab
                    text={"What is your Partner's Email Address?"}  
                    handleChange={setpartnerEmail}
                    checker={partnerIdCheckerAndUpdate}
                />
                <CloseView>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <CloseButton 
                        source={require("../../../assets/BaseApp/close.png")} 
                        />
                    </TouchableOpacity>  
                </CloseView>
            </>
            }  
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
