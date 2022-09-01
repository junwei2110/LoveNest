import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Parse from 'parse/react-native.js';

import { 
    EventModalView, 
    EventModalTextInput,
    TextBox, 
    FlexBox, 
    ReminderChecklist, 
    ChecklistFlexBox,
    ResizeImage } from './styled';
import { InPageModal } from '../../common/InPageModal';
import { RadioButtonArray } from '../../common/RadioButtons';
import { Store } from '../../data';
import { userLoggingEnd, userLoggingInit } from '../../data/actions';


export const EventModal = ({reminder}: {
    reminder: Parse.Object<Parse.Attributes>|null}) => {

    const [globalState, dispatch] = useContext(Store);
    const { currentUser } = globalState;
    const userVisible = currentUser?.id === reminder?.get('userOrCoupleId') ? "User" : "Couple"; 
    const checklistItems: ChecklistItem[] = reminder?.get('checkItems') || [];

    const [title, setTitle] = useState(reminder?.get('title') || "");
    const [dateTime, setDateTime] = useState(reminder?.get('dateTime') || "");
    const [recurrence, setRecurrence] = useState(reminder?.get('recurrence') || "");
    const [indiv, setIndividual] = useState(userVisible);
    const [checkItems, setCheckItems] = useState(checklistItems);
    const [dateModal, setDateModal] = useState(false);
    const [recurrModal, setrecurrModal] = useState(false);
    const [userModal, setUserModal] = useState(false);
    const [checkItemModal, setcheckItemModal] = useState(false);
    const [newCheckItemModal, setNewCheckItemModal] = useState(false);
    const [currentItem, setcurrentItem] = useState({id: "", task: "", isChecked: false});
    const [newCheckItem, setNewCheckItem] = useState("");


    const handleDateChange = (dateInput: Date) => {

        setDateTime(dateInput.toDateString());
        setDateModal(false);
    };

    const handleRecurrChange = (text: string) => {
        setRecurrence(text);
        setrecurrModal(false);
    };

    const handleUserVisibleChange = (text: string) => {
        setIndividual(text);
        setUserModal(false);
    }

    const handleChecklistIsChecked = (selectedItem: ChecklistItem) => {
        const checklistItems = [...checkItems];
        const newChecklist = checklistItems.map((item) => {
            if (item.id === selectedItem.id) {
                console.log(selectedItem.id)
                item.isChecked = !item.isChecked
                return item
            }

            return item
        })
        console.log(newChecklist);
        setCheckItems(() => [...newChecklist]);
    }

    const handleSelectedItem = (selectedItem: ChecklistItem) => {
        setcurrentItem({...selectedItem});
        setcheckItemModal(true);
    }

    const handleChecklistItemDesc = (text: string) => {
        const theCurrentItem = {...currentItem};
        setcurrentItem(() => ({
            ...theCurrentItem,
            task: text
        }));
        console.log(currentItem);
    }

    const handleChecklistItemConfirmation = () => {
        const checklistItems = [...checkItems];
        const newChecklistItems = checklistItems.map((item) => {
            if (item.id === currentItem.id) {
                item.task = currentItem.task;
                return item
            }
            return item
        })
        console.log(newChecklistItems);
        setCheckItems(() => [...newChecklistItems]);
        setcheckItemModal(false);
    }

    const handleNewChecklistItemConfirmation = () => {
        const newId = new Date().toISOString();
        const newChecklistItem = {
            id: newId,
            task: newCheckItem,
            isChecked: false
        };
        setCheckItems(() => [...checkItems, newChecklistItem]);
        setNewCheckItemModal(false);
        setNewCheckItem("");

    }

    //TODO: Update the reminder array in the Store
    const handleUpdate = async () => {
        dispatch(userLoggingInit());
        let reminderObj;

        if (!reminder) {
            reminderObj = new Parse.Object('Reminder');
            reminderObj.set('completionStatus', false);
        } else {
            reminderObj = reminder;
        }
        reminderObj.set('title', title);
        reminderObj.set('dateTime', dateTime);
        reminderObj.set('recurrence', recurrence);

        if (indiv === "User") {
            reminderObj.set('userOrCoupleId', currentUser?.id);
        } else {
            reminderObj.set('userOrCoupleId', currentUser?.get('coupleId'));
        }
        
        reminderObj.set('checkItems', checkItems);
        try {         
            await reminderObj.save();
            dispatch(userLoggingEnd());
            Alert.alert("Reminder Saved");
        } catch(e: any) {
            console.warn(e.message);
            dispatch(userLoggingEnd());
        }
    }


    return (
        <EventModalView>
            <DatePicker
                modal
                mode={"date"}
                open={dateModal}
                date={dateTime ? new Date(dateTime) : new Date()}
                onConfirm={(dateInput) => handleDateChange(dateInput)}
                onCancel={() => setDateModal(false)}
            />
            <InPageModal 
            visible={recurrModal}
            size={30}
            center>
                <RadioButtonArray 
                    valueArray={["One-Time", "Week", "Month", "Annual"]}
                    value={recurrence}
                    setValue={handleRecurrChange}
                    orientation={"vertical"}
                    />
            </InPageModal>

            <InPageModal 
            visible={userModal}
            size={25}
            center>
                <RadioButtonArray 
                    valueArray={["User", "Couple"]}
                    value={indiv}
                    setValue={handleUserVisibleChange}
                    orientation={"vertical"}
                    />
            </InPageModal>

            <InPageModal 
            visible={newCheckItemModal}
            size={25}
            center>
                <>
                <TextInput
                    value={newCheckItem}
                    onChangeText={(text) => setNewCheckItem(text)}
                    style={{borderBottomWidth: 1}}
                    />
                <Text></Text>
                <View style={styles.textInput}>
                    <Button 
                        title={"Confirm"} 
                        onPress={handleNewChecklistItemConfirmation}
                        />
                    <Button 
                        title={"Cancel"} 
                        onPress={() => setNewCheckItemModal(false)}
                        />
                </View>
                </>
            </InPageModal>

            <InPageModal 
            visible={checkItemModal}
            size={25}
            center>
                <>
                <TextInput
                    value={currentItem?.task}
                    onChangeText={(text) => handleChecklistItemDesc(text)}
                    />
                <View style={styles.textInput}>
                    <Button 
                        title={"Confirm"} 
                        onPress={handleChecklistItemConfirmation}
                        />
                    <Button 
                        title={"Cancel"} 
                        onPress={() => setcheckItemModal(false)}
                        />
                </View>
                </>
            </InPageModal>

            <Text>Event Title</Text>
            <EventModalTextInput 
            value={title}
            placeholder={"Event Title"}
            onChangeText={(text) => setTitle(text)}
            />
            <View style={styles.flexContainer}>
                <FlexBox
                    flexRatio={2}
                    onPress={() => setDateModal(true)}
                    centered
                >
                    <Text>Date / Time</Text>
                    <TextBox>
                        {dateTime}
                    </TextBox>
                </FlexBox>

                <FlexBox
                    flexRatio={1}
                    last
                    centered
                    onPress={() => setrecurrModal(true)}
                >
                    <Text>Recurrence</Text>
                    <TextBox>
                        {recurrence}
                    </TextBox>
                </FlexBox>
            </View>
            <View style={styles.flexContainer}>
                <FlexBox
                    flexRatio={1}
                    centered
                >
                    <Text>Visible to</Text>           
                </FlexBox>
                <FlexBox
                    flexRatio={2}
                    last
                    onPress={() => setUserModal(true)}
                >
                    <TextBox>{indiv}</TextBox>
                </FlexBox>
        
            </View>
            <Text>To-Do-List</Text>
            <ReminderChecklist>
                
                {checkItems.map((item, id) => (
                    
                    <View key={id} style={styles.flexContainer}>                        
                        
                        <FlexBox
                            flexRatio={9}
                            onPress={() => handleSelectedItem(item)}
                        >
                            <Text style={styles.textInput}>{item?.task}</Text>           
                        </FlexBox>                        
                        <FlexBox
                            flexRatio={1}
                            last
                        >
                            <BouncyCheckbox 
                                size={20}
                                isChecked={item?.isChecked}
                                onPress={() => handleChecklistIsChecked(item)}
                            />
                        </FlexBox>
                
                    </View>
                
                ))}
                
                <ChecklistFlexBox onPress={() => setNewCheckItemModal(true)}>
                    <ResizeImage 
                        source={require("../../../assets/BaseApp/plus.png")}
                        resizeMode={"contain"}
                        />
                </ChecklistFlexBox>

            </ReminderChecklist>
            <Button 
                title={"Update"} 
                onPress={handleUpdate}
                />

        </EventModalView>


    )
}

type ChecklistItem = {
    id: string;
    task: string;
    isChecked: boolean;
}

type StylesProps = {
    flexContainer: {
        display: "flex" | "none" | undefined;
        flexDirection: "row" | "column";
        margin: string | number;
    },

    textInput: {
        display: "flex" | "none" | undefined;
        flexDirection: "row" | "column" | "row-reverse" ;
    }

}

const styles: StylesProps = {
    flexContainer: {
        display: "flex",
        flexDirection: "row",
        margin: "5%",
    },

    textInput: {
        display: "flex",
        flexDirection: "row-reverse" 
    }

}