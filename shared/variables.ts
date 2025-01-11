import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { defaultVertImageCards } from './database';
import { DataNoID, Types } from '@/shared/types/types';
import { Dimensions, Alert, Platform } from 'react-native';

export const COL = 5;
export const MARGIN = 8;
export const SIZE = Dimensions.get(`window`).width / COL - MARGIN;

export const web = () => Platform.OS == `web`;
export const mobile = () => Platform.OS != `web`;

export const gridSpacing = 15;
export const animationDuration = 300;
export const paginationHeightMargin = 200;
export const cardImageWidth = web() ? `25%` : `33%`;

export const log = (string: string, data?: any) => Platform.OS == `web` ? console.log(string, data) : Alert.alert(string);

export const showDevFeatures = true;
export const localDevelopment = process.env.NODE_ENV == `development`;
export const urlHostIncludes = (string) => window.location.host.includes(string);
export const devEnv = (web() ? (urlHostIncludes(`local`) || urlHostIncludes(`:80`)) : localDevelopment) ? showDevFeatures : false;

export const capWords = (str: string) => str.replace(/\b\w/g, (match) => match.toUpperCase());
export const getNumberFromString = (string: string) => parseInt((string.match(/\d+/) as any)[0]);
export const capitalizeAllWords = (string: string) => string.replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());

export const animationOptions = {
  useNativeDriver: true,
  duration: animationDuration,
}

export const defaultBoardColumns = [
  { 
    name: `Items`, 
    category: `Items`,
    id: `1-listColumn-items`,
    items: [defaultVertImageCards[0], defaultVertImageCards[1]],
  }, 
  { 
    name: `Active`, 
    category: `Active`,
    id: `2-listColumn-active`,
    items: [defaultVertImageCards[2], defaultVertImageCards[3]],
  },
  { 
    name: `Complete`, 
    category: `Complete`,
    id: `3-listColumn-complete`,
    items: [defaultVertImageCards[4], defaultVertImageCards[5], defaultVertImageCards[6]],
  },
]

export const createXML = (xmlString: string) => { 
  let div = document.createElement(`div`); 
  div.innerHTML = xmlString.trim(); 
  return div.firstChild; 
}

export const genTypeID = (type: Types) => {
  let uuid = generateUniqueID();
  let id = `${type}_${uuid}`;
  return id;
}
  
export const getTimezone = (date: Date) => {
  const timeZoneString = new Intl.DateTimeFormat(undefined, {timeZoneName: `short`}).format(date);
  const match = timeZoneString.match(/\b([A-Z]{3,5})\b/);
  return match ? match[1] : ``;
}

export const generateID = () => {
  let id = Math.random().toString(36).substr(2, 9);
  return Array.from(id).map(char => {
    return Math.random() > 0.5 ? char.toUpperCase() : char;
  }).join(``);
}

export const getOrder = (x: any, y: any) => {
  'worklet';
  const row = Math.round(y / SIZE);
  const col = Math.round(x / SIZE);
  return row * COL + col;
}

export const getPosition = (index: any) => {
  'worklet';
  return {
    x: (index % COL) * SIZE,
    y: Math.floor(index / COL) * SIZE,
  }
}
  
export const generateUniqueID = (existingIDs?: string[]) => {
  let newID = generateID();
  if (existingIDs && existingIDs.length > 0) {
    while (existingIDs.includes(newID)) {
      newID = generateID();
    }
  }
  return newID;
}

export const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Location access is required.');
    return;
  }
  let location = await Location.getCurrentPositionAsync({});
  Alert.alert('Location Retrieved', `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`);
}
  
export const removeTrailingZeroDecimal = (number: number, decimalPlaces = 1) => {
  let num = typeof number == `string` ? parseFloat(number) : number;
  const wholeNumber = Math.trunc(num);
  const decimalPart = num - wholeNumber;
  if (decimalPart === 0) {
    return wholeNumber;
  } else {
    return num.toFixed(decimalPlaces);
  }
}

export const generateUniqueItems = (amount: number, data: any = null) => {
  const ids = [];
  const items = [];
  for (let i = 0; i < amount; i++) {
    let id = generateUniqueID(ids);
    ids.push(id);
    items.push({
      id,
      ...data,
    })
  }
  return items;
}

export const countPropertiesInObject = (obj: any) => {
  let count = 0;
  if (typeof obj === `object` && obj !== null) {
    for (const key in obj) {
      count++; // Count the current key
      count += countPropertiesInObject(obj[key]); // Recursively count keys in nested objects
    }
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        count += countPropertiesInObject(item); // Recursively count keys in nested objects within the array
      });
    }
  }
  return count;
}

export const openCamera = async () => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (permission.granted) {
    let result: any = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      if (result.uri != undefined && result.uri != null && result.uri != `` && result.uri.length > 0) {
        Alert.alert('Photo Taken', result.uri);
      } else {
        Alert.alert('Canceled Camera');
      }
    }
  } else {
    Alert.alert('Permission Denied', 'Camera access is required.');
  }
}

export const genID = ({ name = ``, type = Types.Data, index = 1 }: DataNoID) => {
  let uuid = generateUniqueID();
  name = capitalizeAllWords(name);
  let currentDateTimeStamp = formatDate(new Date());
  let currentDateTimeStampNoSpaces = formatDate(new Date(), `timezoneNoSpaces`);
  let id = `${index}_${type}_${name}_${currentDateTimeStampNoSpaces}_${uuid}`;
  let title = `${index} ${name} ${currentDateTimeStamp} ${uuid}`;
  return {
    id,
    name,
    uuid,
    type,
    index,
    title,
    timestamps: {
      currentDateTimeStamp,
      currentDateTimeStampNoSpaces,
    }
  }
}

export const formatDate = (date: any, specificPortion?: any) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? `PM` : `AM`;
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour `0` should be `12`
  minutes = minutes < 10 ? `0` + minutes : minutes;
  let strTime = hours + `:` + minutes + ` ` + ampm;
  let strTimeNoSpaces = hours + `-` + minutes + `-` + ampm;
  let completedDate = strTime + ` ` + (date.getMonth() + 1) + `/` + date.getDate() + `/` + date.getFullYear();
  let timezone = getTimezone(date);

  if (specificPortion == `time`) {
    completedDate = strTime;
  } else if (specificPortion == `date`) {
    completedDate = (date.getMonth() + 1) + `-` + date.getDate() + `-` + date.getFullYear();
  } else if (specificPortion == `timezone`) {
    completedDate = strTime + ` ` + (date.getMonth() + 1) + `-` + date.getDate() + `-` + date.getFullYear() + ` ` + timezone;
  } else if (specificPortion == `timezoneNoSpaces`) {
    completedDate = strTimeNoSpaces + `_` + (date.getMonth() + 1) + `-` + date.getDate() + `-` + date.getFullYear() + `_` + timezone;
  } else {
    completedDate = strTime + ` ` + (date.getMonth() + 1) + `-` + date.getDate() + `-` + date.getFullYear() + ` ` + timezone;
  }

  return completedDate;
}