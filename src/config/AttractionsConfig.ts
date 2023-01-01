import { AttractionType, AttractionSortType } from "../models/enum"

export const AttractionsConfig = [

    {label: "Adventure", value: AttractionType.Adventure},
    {label: "Arts", value: AttractionType.Arts},
    {label: "Fitness", value: AttractionType.Fitness},
    {label: "History", value: AttractionType.History},
    {label: "Leisure", value: AttractionType.Leisure},
    {label: "Nature", value: AttractionType.Nature},
    //{label: "Others", value: AttractionType.Others},


]

export const AttractionsSortConfig = [

    {label: "name", value: AttractionSortType.name},
    {label: "type", value: AttractionSortType.type},
    {label: "desc", value: AttractionSortType.desc},
    {label: "source", value: AttractionSortType.source},



]



