import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Alert, ViewProps, TextProps } from 'react-native';
import DatePicker from 'react-native-date-picker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Parse from 'parse/react-native.js';
import Icon from 'react-native-vector-icons/Feather';

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
import { userLoggingEnd, userLoggingInit, updateReminders } from '../../data/actions';


export const EventModal = ({reminder, setModalVisible}: {
    reminder: GlobalReminderObj|null
    setModalVisible?: (val: boolean) => void}) => {

    const [globalState, dispatch] = useContext(Store);
    const { currentUser, reminderArray } = globalState;
    const userVisible = currentUser?.id === reminder?.userOrCoupleId ? "User" : "Couple"; 
    const checklistItems: ChecklistItem[] = reminder?.checkItems?.length ? JSON.parse(JSON.stringify(reminder?.checkItems)) : []; //Deep copy required for objects in arrays

    const [id, _setId] = useState(reminder?.id || "");
    const [title, setTitle] = useState(reminder?.title || "");
    const [dateTime, setDateTime] = useState(reminder?.dateTime.toDateString() || "");
    const [recurrence, setRecurrence] = useState(reminder?.recurrence || "");
    const [indiv, setIndividual] = useState(userVisible);
    const [checkItems, setCheckItems] = useState(checklistItems);
    const [dateModal, setDateModal] = useState(false);
    const [recurrModal, setrecurrModal] = useState(false);
    const [userModal, setUserModal] = useState(false);
    const [checkItemModal, setcheckItemModal] = useState(false);
    const [currentItem, setcurrentItem] = useState({id: "", task: "", isChecked: false});
    const [newCheckItem, setNewCheckItem] = useState("");
    const [selectNewCheckItem, setSelectNewCheckItem] = useState(false);

    const handleDateChange = (dateInput: Date) => {
        setDateTime(dateInput.toDateString());
        setDateModal(false);
        setrecurrModal(true);
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
        setcheckItemModal(false);
        setSelectNewCheckItem(false);
        setNewCheckItem("");

    }

    const handleUpdate = async () => {
        dispatch(userLoggingInit());
        let reminderParseObj: Parse.Object<Parse.Attributes>;
        let reminderObj: GlobalReminderObj = {
            title,
            dateTime: new Date(dateTime),
            recurrence,
            userOrCoupleId: "",
            checkItems,
            completionStatus: false
        };

        if (!reminder) {
            reminderParseObj = new Parse.Object('Reminder');
            reminderParseObj.set('completionStatus', false);
        } else {
            const reminderParseQuery = new Parse.Query("Reminder");
            reminderParseQuery.equalTo("objectId", id);
            reminderParseObj = await reminderParseQuery.first() || new Parse.Object('Reminder');
        }
        

        if (indiv === "User") {
            reminderParseObj.set('userOrCoupleId', currentUser?.id);
            reminderObj = { ...reminderObj, userOrCoupleId: currentUser?.id };
        } else {
            reminderParseObj.set('userOrCoupleId', currentUser?.get('coupleId'));
            reminderObj = { ...reminderObj, userOrCoupleId: currentUser?.get('coupleId') };
        }
        reminderParseObj.set('title', title);
        reminderParseObj.set('dateTime', dateTime);
        reminderParseObj.set('recurrence', recurrence);
        reminderParseObj.set('checkItems', checkItems);
        
        try {         
            const updatedArr = reminderArray && [...reminderArray] || [];

            if (updatedArr.length) {
                if (!reminder) {
                    //TODO: Use binary sort here
                    const reminderObjDateTime = new Date(dateTime);
                    for (let i=0; i < updatedArr.length; i++) {
                        const arrDate = new Date(updatedArr[i]?.dateTime);
                        if (arrDate >= reminderObjDateTime) {
                            updatedArr.splice(i, 0, reminderObj);
                            break;
                        }
                    }
                } else {
                    for (let j=0; j < updatedArr.length; j++) {
                        if (updatedArr[j].id === reminderParseObj.id) {
                            updatedArr[j] = reminderObj;
                            break;
                        }
                    }
                }

            } else {
                updatedArr.push(reminderObj);
            }
            dispatch(updateReminders(updatedArr));
            await reminderParseObj.save();
            console.log(updatedArr)
            
            dispatch(userLoggingEnd());
            Alert.alert("Reminder Saved");
        } catch(e: any) {
            console.warn(e.message);
            dispatch(userLoggingEnd());
        }
    }

    const handleDelete = async () => {   
        try {
            dispatch(userLoggingInit());
            const reminderParseQuery = new Parse.Query("Reminder");
            console.log(id);
            const reminderParseObj = await reminderParseQuery.get(id);
            await reminderParseObj.destroy();
            setModalVisible?.(false);

            if (reminderArray?.length) {
                const newReminderArr = [...reminderArray].filter((rem) => {
                    return rem.id !== id
                });

                dispatch(updateReminders(newReminderArr));
                //TODO: Add animation to remove the reminder
            };

            dispatch(userLoggingEnd());

        } catch(e: any) {
            dispatch(userLoggingEnd());
            Alert.alert(e.message);
        }

    };

    const handleDeleteCheckItem = () => {
        const checklistItems = [...checkItems];
        const newChecklistItems = checklistItems.filter((item) => {
            return item.id !== currentItem.id
        })
        setCheckItems(() => [...newChecklistItems]);
        setcheckItemModal(false);
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
            center
            returnFn={() => setrecurrModal(false)}>
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
            center
            returnFn={() => setUserModal(false)}>
                <RadioButtonArray 
                    valueArray={["User", "Couple"]}
                    value={indiv}
                    setValue={handleUserVisibleChange}
                    orientation={"vertical"}
                    />
            </InPageModal>

            <InPageModal 
            visible={checkItemModal}
            size={30}
            center
            returnFn={() => setcheckItemModal(false)}>
                <>
                <TextInput
                    value={selectNewCheckItem ? newCheckItem : currentItem?.task}
                    onChangeText={(text) => {
                        selectNewCheckItem ? setNewCheckItem(text) : handleChecklistItemDesc(text)
                    }}
                    style={{borderBottomWidth: 1, marginHorizontal: 20, paddingVertical: 0}}
                    />

                <View style={styles.confirmDeleteContainer as ViewProps}>
                    <TouchableOpacity
                    style={styles.confirmBtn} 
                    onPress={selectNewCheckItem ? handleNewChecklistItemConfirmation : handleChecklistItemConfirmation}>
                        <Text style={{color: "black"}}>Confirm</Text>
                    </TouchableOpacity>
                    {!selectNewCheckItem ? 
                    <TouchableOpacity
                    style={styles.deleteBtn}  
                    onPress={() => {
                        handleDeleteCheckItem()
                        setcheckItemModal(false);
                    }}>
                        <Text style={{color: "black"}}>Delete Item</Text>
                    </TouchableOpacity>
                    : null}
                </View>

                </>
            </InPageModal>

            <Text>Event Title</Text>
            <EventModalTextInput 
            value={title}
            placeholder={"Event Title"}
            onChangeText={(text) => setTitle(text)}
            />
            <View style={styles.flexContainer as ViewProps}>
                <FlexBox
                    flexRatio={2}
                    onPress={() => setDateModal(true)}
                    centered
                >
                    <Text>Date / Recurrence</Text>
                    <TextBox numberOfLines={1}>
                        {`${dateTime} / ${recurrence}`}
                    </TextBox>
                </FlexBox>

                <FlexBox
                    flexRatio={1}
                    last
                    centered
                    onPress={() => setUserModal(true)}
                >
                    <Text>Visible to</Text>
                    <TextBox>
                        {indiv}
                    </TextBox>
                </FlexBox>
            </View>
            <Text></Text>
            <Text>
                <Icon name="list" size={18} /> To-Do-List
            </Text>
            <View style={{maxHeight: "45%", width: "100%"}}>
                <ReminderChecklist> 
                    {checkItems.map((item, id) => (        
                        <View key={id} style={styles.checklistContainer as ViewProps}>                        
                            <FlexBox
                                flexRatio={9}
                                onPress={() => handleSelectedItem(item)}
                            >
                                <Text 
                                style={styles.textInput as ViewProps}
                                numberOfLines={1}>
                                    {item?.task}
                                </Text>           
                            </FlexBox>                        
                            <FlexBox
                                flexRatio={1}
                                last
                            >
                                <BouncyCheckbox 
                                    size={20}
                                    isChecked={item?.isChecked}
                                    disableBuiltInState
                                    onPress={() => handleChecklistIsChecked(item)}
                                    fillColor="red"
                                />
                            </FlexBox>    
                        </View>
                    
                    ))}

                </ReminderChecklist>
            </View>
            <ChecklistFlexBox onPress={() => {
                setcheckItemModal(true);
                setSelectNewCheckItem(true);
            }}>
                <ResizeImage 
                    source={require("../../../assets/BaseApp/plus.png")}
                    resizeMode={"contain"}
                    />
            </ChecklistFlexBox>

            

            <View style={reminder ? SingleDoubleButtonStyles.doubleButton as ViewProps
                : SingleDoubleButtonStyles.singleButton as ViewProps}>
                <TouchableOpacity
                style={reminder? SingleDoubleButtonStyles.doubleUpdateBtn : SingleDoubleButtonStyles.singleUpdateBtn}
                onPress={handleUpdate}>
                    <Text style={buttonStyles.updateText as TextProps}>Update</Text>
                </TouchableOpacity>
                {reminder ? 
                <TouchableOpacity
                style={buttonStyles.delete}
                onPress={handleDelete}>
                    <Text style={buttonStyles.deleteText as TextProps}>Delete</Text>
                </TouchableOpacity> : null}              
            </View>
        </EventModalView>
        


    )
}


export type GlobalReminderObj = {
    id?: string;
    title: string;
    dateTime: Date;
    recurrence: string;
    userOrCoupleId: string;
    checkItems?: ChecklistItem[];
    completionStatus: boolean;
}

export type ChecklistItem = {
    id: string;
    task: string;
    isChecked: boolean;
}


const styles = {
    flexContainer: {
        display: "flex",
        flexDirection: "row",
        margin: "5%"
    },

    checklistContainer: {
        display: "flex",
        flexDirection: "row",
        marginVertical: "3%",
        marginHorizontal: "5%"
    },

    confirmDeleteContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "5%",
        marginHorizontal: "5%",
        
    },

    confirmBtn: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#f9caa7",
    },
    deleteBtn: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#fe9c8f",
    },

    textInput: {
        display: "flex",
        flexDirection: "row",
        borderWidth: 1,
        paddingVertical: 10,
        paddingLeft: 20,
        borderRadius: 25,
         
    }

}

const buttonStyles = {
    buttonContainer: {
        display: "flex", 
        flexDirection: "row",
        position: "absolute",
        borderWidth: 1,
        bottom: "7%"
    },

    update: {
        borderWidth: 1,
        padding: 15,
        borderRadius: 0,
        backgroundColor: "#f9caa7",

    },
    delete: {
        borderWidth: 1,
        padding: 15,
        borderRadius: 0,
        backgroundColor: "#fe9c8f",
        width: "50%"

        
    },
    updateText: {
        color: "black",
        textAlign: "center",
    },
    deleteText: {
        color: "black",
        textAlign: "center",
    }
}

const SingleDoubleButtonStyles = {
    singleButton: {
      ...buttonStyles.buttonContainer,
      width: "45%"  
    },
    doubleButton: {
        ...buttonStyles.buttonContainer,
        width: "90%"  
    },
    singleUpdateBtn: {
        ...buttonStyles.update,
        width: "100%"  

    },
    doubleUpdateBtn: {
        ...buttonStyles.update,
        width: "50%"  

    },
}