import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions, Alert, Platform, Vibration } from 'react-native';
import { BoardTypes, IDData, Types, Views } from '@/shared/types/types';

export const COL = 5;
export const MARGIN = 8;

export const web = () => Platform.OS == `web`;
export const mobile = () => Platform.OS != `web`;

export const gridSpacing = 15;
export const scrollSensitivity = 10;
export const animationDuration = 300;
export const paginationHeightMargin = 200;
export const cardImageWidth = web() ? `25%` : `33%`;

export const itemHeight = 35;
export const useDatabase = true;
export const paginationSize = 5;
export const tabBarIconSize = 18;
export const maxItemNameLength = 15;
export const maxTaskNameLength = 28;
export const maxItemSummaryLength = 125;
export const delayBeforeScrollingDown = 175;
export const maxItemDescriptionLength = 250;
export const defaultBoardID = `3_Column_${BoardTypes.Kanban}`;
export const SIZE = Dimensions.get(`window`).width / COL - MARGIN;

export const showDevFeatures = true;
export const localDevelopment = process.env.NODE_ENV == `development`;
export const urlHostIncludes = (string) => window.location.host.includes(string);
export const devEnv = (web() ? (urlHostIncludes(`local`) || urlHostIncludes(`:`)) : localDevelopment) ? showDevFeatures : false;

export const capWords = (str: string) => str.replace(/\b\w/g, (match) => match.toUpperCase());
export const getNumberFromString = (string: string) => parseInt((string.match(/\d+/) as any)[0]);
export const capitalizeAllWords = (string: string) => string.replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());

export const log = (string: string, data?: any, alert = false) => {
  if (alert == true && Platform.OS != `web`) Alert.alert(string);
  if (data) devEnv && console.log(string, ((typeof data == `object` && Object.keys(data).length > 0) || Array.isArray(data) ? (
    JSON.stringify(data, null, 2)
  ) : data));
  else devEnv && console.log(string);
}

export const logLine = (str: string, num: number) => log(str.repeat(num));
export const logNewLine = (str: string, num: number) => {
  log(`\n`);
  log(str.repeat(num));
  log(`\n`);
};

export const logMsgLine = (logMessage: string) => {
  const logMessageLength = logMessage?.length;
  logNewLine(`.`, logMessageLength);
  log(logMessage);
}

export const animationOptions = {
  useNativeDriver: true,
  duration: animationDuration,
}

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

export const generateID = () => {
  let id = Math.random().toString(36).substr(2, 9);
  return Array.from(id).map(char => {
    return Math.random() > 0.5 ? char.toUpperCase() : char;
  }).join(``);
}

export const combineArraysByKey = <T>(data: T[], key: keyof T): any[] => {
  return data.reduce((combined, item) => {
    const arrayToCombine = item[key];
    if (Array.isArray(arrayToCombine)) {
      return combined.concat(arrayToCombine); // Combine if it's an array
    }
    return combined; // Skip if the key's value is not an array
  }, [] as any[]); // Start with an empty array
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

export const toFixedWithoutRounding = (value, decimalPlaces) => {
  const str = value.toString();
  const [integerPart, fractionalPart] = str.split(`.`);
  if (!fractionalPart || fractionalPart.length <= decimalPlaces) {
    return str + (fractionalPart ? `` : `.`) + `0`.repeat(decimalPlaces - (fractionalPart?.length || 0));
  }
  return `${integerPart}.${fractionalPart.slice(0, decimalPlaces)}`;
}

export const getLocation = async () => {
  Vibration.vibrate(1);
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

export const isValid = (item) => {
  if (typeof item == `string`) {
    let isInvalidString = !item || item == `` || item.trim() == `` || item == undefined || item == null;
    return !isInvalidString;
  } else if (typeof item == `number`) {
    let isInvalidNumber = isNaN(item) || item == undefined || item == null;
    return !isInvalidNumber;
  } else if (typeof item == `object` && item != undefined && item != null) {
    let isInvalidObject = Object.keys(item).length == 0 || item == undefined || item == null;
    return !isInvalidObject;
  } else {
    let isUndefined = item == undefined || item == null;
    return !isUndefined;
  }
}

export const openCamera = async () => {
  Vibration.vibrate(1);
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

export const genID = (type: Types | Views = Types.Data, index = 1): IDData => {
  let now = new Date();
  let uuid = generateUniqueID();
  let date = now.toLocaleString(`en-US`);
  let currentDateTimeStamp = formatDate(now);
  let currentDateTimeStampNoSpaces = formatDate(now, `timezoneNoSpaces`);
  let title = `${index} ${type} ${currentDateTimeStamp} ${uuid}`;
  let id = `${index}_${type}_${currentDateTimeStampNoSpaces}_${uuid}`;
  return new IDData({
    id,
    date,
    uuid,
    type,
    index,
    title,
    currentDateTimeStamp,
    currentDateTimeStampNoSpaces,
  }) as IDData
}

export const findHighestNumberInArrayByKey = async ( arrayOfObjects: any[], key: string ): Promise<number | null> => {
  try {
    const filteredNumbers = arrayOfObjects
      .map(obj => obj[key])
      .filter(value => typeof value === `number`);

    if (filteredNumbers.length === 0) {
      // log(`No valid numbers found for key '${key}'`);
      return 0;
    }

    const highestNumber = Math.max(...filteredNumbers);
    return highestNumber;
  } catch (error) {
    log(`Error while finding the highest number for key '${key}'`, error);
    return 0;
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