import { sortBy } from "ramda";

let i = 1;
const cityMap = {
    'coquitlam': i++,
    'port coquitlam': i++,
    'port moody': i++,
    'vancouver': i++,
    'west vancouver': i++,
    'north vancouver': i++,
    'burnaby': i++,
    'westminster': i++,
    'richmond': i++,
    'pitt meadows': i++,
    'maple ridge': i++,
    'delta': i++,
    'surrey': i++,
    'langley': i++,
    'abbotsford': i++,
    'chilliwack': i++,
};

i = 1;
const ageMap = {
    '10대 이하': i++,
    '10대': i++,
    '20대': i++,
    '30대': i++,
    '40대': i++,
    '50대': i++,
    '60대': i++,
    '70대': i++,
    '80대': i++,
    '90대': i++,
    '90대 이상': i++,
};

const orderBy = (keySelector, orderMap, data) => {
    return sortBy(d => {
        const key = `${keySelector(d)}`.toLowerCase();
        return orderMap[key] || 100; 
    }, data);
};


export const orderByArea = (keySelector, data) => orderBy(keySelector, cityMap, data);
export const orderByAge = (keySelector, data) => orderBy(keySelector, ageMap, data);