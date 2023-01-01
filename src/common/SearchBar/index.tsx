import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, FlexStyle, StyleProp, Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewProps } from 'react-native';
import { Trie } from '../../utils/functions/trie';
import { mockData } from './mockData';
import { debounce } from '../../utils/functions/debounce';

export const SearchBar = ({searchBarStyle, marginTop, trieClass, onSelectFunc} : {
    searchBarStyle?: TextInputProps;
    marginTop?: number;
    trieClass?: Trie;
    onSelectFunc?: (val: string) => void;
}) => {
    const [textVal, setTextVal] = useState("");
    const [dropDownTop, setDropDownTop] = useState(0);
    const [dropDownLeft, setDropDownLeft] = useState(0);
    const [dropDownWidth, setDropDownWidth] = useState(0);
    const [showDropDown, setShowDropDown] = useState(false);
    const [searchSet, setSearchSet] = useState(new Set());
    const searchTermContainer = useRef<TextInput | null>();
    const timerRef = useRef<NodeJS.Timeout | null | undefined>();




    const getHistoricalSearches = (search: string) => {
        
        const searchSet = trieClass?.trieUsage(search);
        searchSet && setSearchSet(() => searchSet);

    }
    
    const debouncedSearches = debounce((search: string) => getHistoricalSearches(search), 500, timerRef);

    const handleDropDown = () => {
        if (searchTermContainer.current) {
            searchTermContainer.current.measure((_fx: number, _fy: number, w: number, h: number, px: number, py: number) => {
                setShowDropDown(true);
                setDropDownWidth(w);
                setDropDownTop(h + (marginTop ? marginTop : 0));
                setDropDownLeft(px);
            });
            getHistoricalSearches(textVal);
        }
    }

    const onSelectItemWithoutClosing = (item: string) => {
        setTextVal(item);
        debouncedSearches(item);
        onSelectFunc?.(item);    
    }

    const onSelectItemWithClosing = (item: string) => {
        onSelectItemWithoutClosing(item);
        setShowDropDown(false);
        onSelectFunc?.(item);

    }

    const renderItem = ({item} : {item: string}) => {

        return (
            <TouchableOpacity onPress={() => {
                onSelectItemWithClosing(item);
            }}>
                <Text>{item}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <>
            <TextInput
            ref={searchTermContainer as MutableRefObject<TextInput>} 
            style={searchBarStyle} 
            onFocus={handleDropDown}        
            onChangeText={(text) => onSelectItemWithoutClosing(text)}
            onBlur={() => setShowDropDown(false)}
            value={textVal}
            numberOfLines={1}
            placeholder={"Insert something here"} 
            />
            {trieClass && showDropDown ?
            <View
            style={[style.flatList, {width: dropDownWidth, left: dropDownLeft, top: dropDownTop}] as ViewProps}
            >
                <FlatList 
                data={Array.from(searchSet).flat() as string[] || []}
                renderItem={renderItem}
                keyboardShouldPersistTaps={"handled"}
                />
            </View>
            : null}
        </>
    )
}

const style = {
    container: {
        height: "100%",
        borderWidth: 1,
        borderRadius: 25
    },
    flatList: {
        position: "absolute",
        borderRadius: 15,
        paddingLeft: "5%",
        paddingVertical: 5,
        backgroundColor: '#fec8c1',
        maxHeight: 150,
        zIndex: 99
    }
}
