import React from 'react';
import { ATTRACTIONS_SEARCH_URL, TOURISM_API_KEY } from 'react-native-dotenv';


export class AttractionsAPI {

    network: string;

    constructor() {
        this.network = ATTRACTIONS_SEARCH_URL;
    }


    getAttractionsDetails = (queryParams: QueryParamsProps) => {
        const networkUrl = queryParams.sortBy ? `${this.network}?keyword=${queryParams.keyword}&language=en&sortBy=${queryParams.sortBy}&apikey=${TOURISM_API_KEY}` : 
                                `${this.network}?keyword=${queryParams.keyword}&language=en&apikey=${TOURISM_API_KEY}`;
        
        console.log(networkUrl);
        const data = fetch(networkUrl).then((res) => res.json());
        return data
    }


}

type QueryParamsProps = {
    keyword: string;
    sortBy?: string;
}