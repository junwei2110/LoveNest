import React from 'react';
import { SlideShowLink } from "../models/enum";

const dateNightSrc = require('../../assets/BaseApp/dateNight.png');
const memoriesSrc = require('../../assets/BaseApp/memories.png');
const storiesSrc = require('../../assets/BaseApp/stories.png');

const dateNightDesc = "Find out what places to go";
const memoriesDesc = "Re-live your past photos";
const storiesDesc = "Tell your loved one your day";

export type ImageStackParamList = {
    [key in SlideShowLink]: undefined;
};

type ImageSlide = {
    src: any;
    description: string;
    link: SlideShowLink;
}

export const imageSlideShowConfig: ImageSlide[] = [
    {
        src: dateNightSrc,
        description: dateNightDesc,
        link: SlideShowLink.DatePlanner,
    },

    {
        src: memoriesSrc,
        description: memoriesDesc,
        link: SlideShowLink.MediaSearch,
    },

    {
        src: storiesSrc,
        description: storiesDesc,
        link: SlideShowLink.Stories,
    },


]