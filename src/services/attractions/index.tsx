import React from 'react';
import { ATTRACTIONS_SEARCH_URL, TOURISM_API_KEY } from 'react-native-dotenv';


export class AttractionsAPI {

    network: string;

    constructor() {
        this.network = ATTRACTIONS_SEARCH_URL;
    }


    getAttractionsDetails = (queryParams: QueryParamsProps) => {
        const sortByUrl = queryParams.sortBy ? `${this.network}?keyword=${queryParams.keyword}&language=en&sortBy=${queryParams.sortBy}` : 
                                `${this.network}?keyword=${queryParams.keyword}&language=en`;
        
        const networkUrl = queryParams.nextToken ? `${sortByUrl}&nextToken=${queryParams.nextToken}&apikey=${TOURISM_API_KEY}` : 
                                `${sortByUrl}&apikey=${TOURISM_API_KEY}`;

        const data = fetch(networkUrl).then((res) => res.json());
        return data
    }


}

type QueryParamsProps = {
    keyword: string;
    sortBy?: string;
    nextToken?: string;
}