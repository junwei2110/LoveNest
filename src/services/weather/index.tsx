import React from 'react';
import { NEA_WEATHER_API } from "react-native-dotenv";

export class WeatherForecastAPI {
    dateTime: Date;
    network: string;

    constructor(dateTime: Date) {
        this.dateTime = dateTime;
        this.network = NEA_WEATHER_API;
    }

    fetchWeatherForecast() {
        const data = fetch(this.network).then((res) => res.json());
        return data

    }
}

//Initialize the class in the store
//