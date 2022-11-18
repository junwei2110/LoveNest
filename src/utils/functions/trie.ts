import React from 'react';
//Create the Trie with the historical Search array
/* For each word, check if the alphabet exist in the key, then go into the value and go to the 2nd letter, 
If no key exists, create it with the value pair an empty set. Then go to the 2nd letter and repeat above step with the value
If it is the last letter of the string, check if there is a completedWords key, else create it with an empty set. Then add the string to the set
[Apple, Pear, Apricot]
1. Check if A exist in set
1a. A exists - Go into the value (a set)
1b. A does not exist, create a new set and attach it to the newly create A key, then go into the new set
2. Go to P
*/

export const trieCreation = (data: string[]) => {
    
    const trie = new Map();
    let trie_current_map;

    data.forEach((string) => {
        const modifiedString = string.toLowerCase();
        trie_current_map = trie;
        const strlen = string.length;

        for (const [idx, letter] of [...modifiedString].entries()) {
            if (!trie_current_map.has(letter)) {
                trie_current_map.set(letter, new Map());
            } 

            if (!trie_current_map.has("numberOfWords")) {
                trie_current_map.set("numberOfWords", 1);
            } else {
                const wordNum = trie_current_map.get("numberOfWords");
                trie_current_map.set("numberOfWords", wordNum + 1);
            }

            if (idx === strlen-1) {                
                if (!trie_current_map.has("completedWords")) {
                    trie_current_map.set("completedWords", new Set());
                } 
                trie_current_map.get("completedWords").add(modifiedString);
            }
            
            trie_current_map = trie_current_map.get(letter);
        
        }
    })

    return trie;

};

//Use the Trie as intended
/* For each letter, check if the alphabet exist in the key, 
If the letter exist, then go into the value
if the letter does not exist, check if there is a completedWords key and add the values to the final array
DFS into each existing key in the current map and if there is a completedWords key, add the values to the final array
*/


export const trieUsage = (searchTerm: string, trie: Map<any, any>, historicalArray: Set<any>) => {
    let currentCompletedWords;
    let trieMap = trie;
    const modifiedSearchTerm = searchTerm.toLowerCase();
    const strlen = modifiedSearchTerm.length;

    function trieDFS(currentTrieMap: Map<any, any>) {
        if (currentTrieMap.size === 0) {
            return;
        }
        currentCompletedWords = currentTrieMap.get("completedWords");
        
        if (currentCompletedWords) {
            historicalArray.add(Array.from(currentCompletedWords));
        }

        for (const letter of currentTrieMap.keys()) {
            if (letter !== "completedWords" && letter !== "numberOfWords") {
                trieDFS(currentTrieMap.get(letter));
            }
        }
    }


    for (const letter of modifiedSearchTerm) {
        if (trieMap.has(letter)) {
            trieMap = trieMap.get(letter);
        } else {
            break;
        }
    }

    trieDFS(trieMap);

    return historicalArray;

}

//Update trie
//Add a word into the trie
/* 
iterate through the word
If the letter exists, then just go into it
If the letter does not exist, generate a map then go into it
At the last char, check if there is a completedWords key, else create it
Add the new word into the completedWords key
*/

export const trieAddition = (trie: Map<any,any>, newWord: string) => {

    let current_trie_map = trie;
    const modifiedString = newWord.toLowerCase();
    const strlen = newWord.length;

    for (const [idx, letter] of [...modifiedString].entries()) {
        if (!current_trie_map.has(letter)) {
            current_trie_map.set(letter, new Map());
        }

        if (!current_trie_map.has("numberOfWords")) {
            current_trie_map.set("numberOfWords", 1);
        } else {
            const wordNum = current_trie_map.get("numberOfWords");
            current_trie_map.set("numberOfWords", wordNum + 1);

        }

        if (idx === strlen-1) {                
            if (!current_trie_map.has("completedWords")) {
                current_trie_map.set("completedWords", new Set());
            } 
            current_trie_map.get("completedWords").add(modifiedString);
        }
        
        current_trie_map = current_trie_map.get(letter);
    }


    return trie;

}



//Delete a  word
/* 
iterate through the word
APPLE
APPLEPIE
APPLESODA
ASADA

First, check if the letter exist in the trie, else return that no such historical thing is inside
At each level of the trie, check the key numberOfWords 
if numberOfWords > 1, there are other words and you need to keep that level
Once you reach a level where numberOfWords = 1, you can overwrite that level
ELSE
if you reach the last char and there are still > 1 numberOfWords, then just delete the specified word from the completedWords key 
*/

export const trieDeletion = (trie: Map<any,any>, word: string) => {

    const modifiedString = word.toLowerCase();
    const strlen = word.length;
    let current_trie_map = trie;
    let prev_trie_map: Map<any,any> | null = null;
    let prev_letter: string | null = null;

    for (const [idx, letter] of [...modifiedString].entries()) {
        if (!current_trie_map?.has(letter)) {
            return trie;
        }
        if (current_trie_map.get("numberOfWords") === 1) {
            if (!prev_trie_map) {
                
                current_trie_map.delete(letter);
            } else {
                prev_trie_map.delete(prev_letter);
            }
            
            return trie;
        } 

        if (idx === strlen - 1) {    
            const completedWords = current_trie_map.get("completedWords");
            if (completedWords?.length > 1) {
                completedWords.delete(modifiedString);
            } else {
                current_trie_map.delete("completedWords")
            }
            
        }

        const wordNum = current_trie_map.get("numberOfWords");
        current_trie_map.set("numberOfWords", wordNum - 1);
        prev_letter = letter;
        prev_trie_map = current_trie_map;
        current_trie_map = current_trie_map.get(letter);

    }

    return trie;

}


//This class combines all 4 functions above

export class Trie {

    trie: Map<any,any>;
    data: string[];

    constructor(data: string[]) {
        console.log("Trie created", data);
        this.trie = new Map();
        this.data = data;

        this.trieCreation();
    }

    trieCreation() {
        let trie_current_map;

        this.data.forEach((string) => {
            const modifiedString = string.toLowerCase();
            trie_current_map = this.trie;
            const strlen = string.length;

            for (const [idx, letter] of [...modifiedString].entries()) {
                if (!trie_current_map.has(letter)) {
                    trie_current_map.set(letter, new Map());
                } 

                if (!trie_current_map.has("numberOfWords")) {
                    trie_current_map.set("numberOfWords", 1);
                } else {
                    const wordNum = trie_current_map.get("numberOfWords");
                    trie_current_map.set("numberOfWords", wordNum + 1);
                }

                if (idx === strlen-1) {                
                    if (!trie_current_map.has("completedWords")) {
                        trie_current_map.set("completedWords", new Set());
                    } 
                    trie_current_map.get("completedWords").add(modifiedString);
                }
                
                trie_current_map = trie_current_map.get(letter);
            
            }
        })


        }
    
    trieUsage(searchTerm: string) {
        const historicalArray = new Set();
        let currentCompletedWords;
        let trieMap = this.trie;
        const modifiedSearchTerm = searchTerm.toLowerCase();
        const strlen = modifiedSearchTerm.length;

        function trieDFS(currentTrieMap: Map<any, any>) {
            if (currentTrieMap.size === 0) {
                return;
            }
            currentCompletedWords = currentTrieMap.get("completedWords");
            
            if (currentCompletedWords) {
                historicalArray.add(Array.from(currentCompletedWords));
            }

            for (const letter of currentTrieMap.keys()) {
                if (letter !== "completedWords" && letter !== "numberOfWords") {
                    trieDFS(currentTrieMap.get(letter));
                }
            }
        }


        for (const letter of modifiedSearchTerm) {
            if (trieMap.has(letter)) {
                trieMap = trieMap.get(letter);
            } else {
                break;
            }
        }

        trieDFS(trieMap);

        return historicalArray;


    }


    trieAddition(newWord: string) {
        let current_trie_map = this.trie;
        const modifiedString = newWord.toLowerCase();
        const strlen = newWord.length;

        for (const [idx, letter] of [...modifiedString].entries()) {
            if (!current_trie_map.has(letter)) {
                current_trie_map.set(letter, new Map());
            }

            if (!current_trie_map.has("numberOfWords")) {
                current_trie_map.set("numberOfWords", 1);
            } else {
                const wordNum = current_trie_map.get("numberOfWords");
                current_trie_map.set("numberOfWords", wordNum + 1);

            }

            if (idx === strlen-1) {                
                if (!current_trie_map.has("completedWords")) {
                    current_trie_map.set("completedWords", new Set());
                } 
                current_trie_map.get("completedWords").add(modifiedString);
            }
            
            current_trie_map = current_trie_map.get(letter);
        }

    }

    trieDeletion(word: string) {
        const modifiedString = word.toLowerCase();
        const strlen = word.length;
        let current_trie_map = this.trie;
        let prev_trie_map: Map<any,any> | null = null;
        let prev_letter: string | null = null;
    
        for (const [idx, letter] of [...modifiedString].entries()) {
            if (!current_trie_map?.has(letter)) {
                return;
            }
            if (current_trie_map.get("numberOfWords") === 1) {
                if (!prev_trie_map) {
                    
                    current_trie_map.delete(letter);
                } else {
                    prev_trie_map.delete(prev_letter);
                }
                
                return;
            } 
    
            if (idx === strlen - 1) {    
                const completedWords = current_trie_map.get("completedWords");
                if (completedWords?.length > 1) {
                    completedWords.delete(modifiedString);
                } else {
                    current_trie_map.delete("completedWords")
                }
                
            }
    
            const wordNum = current_trie_map.get("numberOfWords");
            current_trie_map.set("numberOfWords", wordNum - 1);
            prev_letter = letter;
            prev_trie_map = current_trie_map;
            current_trie_map = current_trie_map.get(letter);
    
        }
    
    }

}