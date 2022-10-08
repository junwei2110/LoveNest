import React, { LegacyRef, MutableRefObject, ReactElement, useRef, useState } from 'react';
import { Modal, FlatList, View, TouchableOpacity, Text, ViewProps, TextInput } from 'react-native';

import { AttractionType } from '../../models/enum';

export const Dropdown = ({label, data, onSelect, styling} : {
    label: string | undefined;
    data: Item[];
    onSelect?: (val:string) => void;
    styling?: Record<string, any> 
}) => {

    const [visible, setVisible] = useState(false);
    const [btnLabel, setBtnLabel] = useState(label);
    const [dropDownTop, setDropDownTop] = useState(0);
    const [dropDownLeft, setDropDownLeft] = useState(0);
    const [dropDownWidth, setDropDownWidth] = useState(0);

    const DropDownBtn = useRef<TouchableOpacity>(null);



    const onSelectItem = (item: Item) => {
        setBtnLabel(item.label);
        setVisible(false);
        onSelect?.(item.value);
    }

    const handleDropDown = () => {
        if (DropDownBtn.current) {
            DropDownBtn.current.measure((_fx: number, _fy: number, w: number, h: number, px: number, py: number) => {
                setDropDownTop(py+h+1);
                setDropDownLeft(px);
                setDropDownWidth(w);
            })

        }  
        setVisible(true);
    }

    const renderItem = ({ item }: { item: Item }) => (
        <TouchableOpacity 
        onPress={() => onSelectItem(item)}
        style={[styles.indivDropdown, { ...styling?.indivDropdown }]}>
            <Text numberOfLines={1}>{item.label}</Text>
        </TouchableOpacity>
    );

    return(
        <View style={[styles.container, { ...styling?.container }]}>
            <TouchableOpacity 
            ref={DropDownBtn}
            onPress={handleDropDown}
            style={[styles.button, { ...styling?.button }]}
            >
                <Text>{btnLabel}</Text>
            </TouchableOpacity>

            <Modal
            transparent
            visible={visible}>
                <TouchableOpacity
                onPress={() => setVisible(false)}
                style={styles.overlay}
                >
                    <View style={[styles.dropdown, {top: dropDownTop, left: dropDownLeft, width: dropDownWidth, ...styling?.dropdown}] as ViewProps}>
                        <FlatList 
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
            
        </View>
    )
    


}

type Item = {
    label: string;
    value: string;
}

const styles = {
    container: {
        height: "100%", 
        width: "100%"
    },
    button: {
        marginTop: 10,    
    },
    indivDropdown: {
        paddingVertical: 5,      
    },
    overlay: {
        height: "100%",
        width: "100%"
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: '#fec8c1',
        opacity: 0.9,

    },

}
