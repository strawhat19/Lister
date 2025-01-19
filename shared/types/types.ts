import { colors } from '@/components/theme/Themed';

export type Type = {
    type: Types | Views; 
}

export type DataNoID = {
    name?: string; 
    index?: number;
} & Type;

export type Data = {
    id?: string;
} & DataNoID;

export enum Types {
    Tab = `Tab`,
    Data = `Data`,
}

export enum Themes {
    Dark = `dark`,
    Light = `light`,
}

export enum Directions {
    Left = 1,
    Right = -1,
}

export enum Orientations {
    Portrait = `Portrait`,
    Landscape = `Landscape`,
}

export type ThemeProps = {
    darkColor?: string;
    lightColor?: string;
}

export enum BoardTypes {
    Tier = `Tier`,
    Grid = `Grid`,
    Kanban = `Kanban`,
}

export enum ItemViews {
    Tasks = `Tasks`,
    Images = `Images`,
    Details = `Details`,
    Summary = `Summary`,
    Comments = `Comments`,
}

export enum Views {
    Item = `Item`,
    Task = `Task`,
    Board = `Board`,
    Column = `Column`,
    ItemForm = `Item Form`,
}

export class ItemViewType {
    selected: ItemType | null;
    backgroundColor?: keyof typeof colors | string = `appleBlue`;
    constructor(data: Partial<ItemViewType>) {
        Object.assign(this, data);
    }
}

export class IDData {
    id: any;
    index: number;
    date: Date | string;
    type: Views | Types;
    uuid: string | number | any;
    title: string | number;
    currentDateTimeStamp: string;
    currentDateTimeStampNoSpaces: string;
    constructor(data: Partial<IDData>) {
        Object.assign(this, data);
    }
}

export class CustomImageType {
    alt: string;
    style?: any;
    source: any;
    effect: any = `blur`; 
    id?: any = `customImageID`;
    width: number | string = 750; 
    height: number | string = 1260;
    className: string = `customImageClass`;
    useReactLazyLoadOnMobile: boolean = false;
    constructor(data: Partial<CustomImageType>) {
        Object.assign(this, data);
    }
}

export class BoardType {
    // Meta
    A?: any;
    B?: any;
    C?: any;
    key?: any;
    index?: number;
    id: string | number | any;
    uuid?: string | number | any;
    type?: string | Views | Types = Views.Board;

    // Relational
    items?: ItemType[] = [];
    columns?: ColumnType[] = [];
    userID!: string | number | any;
    listIDs?: string[] | number[] = [];
    itemIDs?: string[] | number[] = [];

    // Data
    name: string;
    count?: number = 1;
    creator?: string = ``;
    complete?: boolean = false;
    boardType?: BoardTypes = BoardTypes.Kanban;
    color?: typeof colors | string = colors.mainBG;
    created?: string | Date = new Date().toLocaleString(`en-US`);
    updated?: string | Date = new Date().toLocaleString(`en-US`);
    backgroundColor?: keyof typeof colors | string = colors.mainBG;

    constructor(data: Partial<BoardType>) {
        Object.assign(this, data);
    }
}

export class ColumnType {
    // Meta
    A?: any;
    B?: any;
    C?: any;
    key?: any;
    index?: number;
    id: string | number | any;
    uuid?: string | number | any;
    type?: string | Views | Types = Views.Column;

    // Relational
    items: ItemType[] = [];
    listID?: string | number;
    boardID!: string | number;
    itemIDs?: string[] | number[] = [];

    // Data
    name: string;
    category: string;
    count?: number = 1;
    creator?: string = ``;
    complete?: boolean = false;
    color?: typeof colors | string = colors.listsBG;
    created?: string | Date = new Date().toLocaleString(`en-US`);
    updated?: string | Date = new Date().toLocaleString(`en-US`);
    backgroundColor?: keyof typeof colors | string = colors.listsBG;

    constructor(data: Partial<ColumnType>) {
        Object.assign(this, data);
    }
}

export class ItemType {
    // Meta
    A?: any;
    B?: any;
    C?: any;
    key?: any;
    index?: number;
    count?: number = 1;
    id: string | number | any;
    uuid?: string | number | any;
    type?: string | Views | Types = Views.Item;

    // Relational
    tasks?: TaskType[] = [];
    listID!: number | string;
    boardID?: number | string;
    taskIDs?: number[] | string[] = [];

    // Data
    image?: any;
    name: string = ``;
    fontColor?: string;
    summary: string = ``;
    creator?: string = ``;
    description: string = ``;
    complete?: boolean = false;
    color?: typeof colors | string = colors.activeColor;
    orientation?: string | Orientations = Orientations.Portrait;
    created?: string | Date = new Date().toLocaleString(`en-US`);
    updated?: string | Date = new Date().toLocaleString(`en-US`);
    backgroundColor?: keyof typeof colors | string = colors.activeColor;
    
    constructor(data: Partial<ItemType>) {
        Object.assign(this, data);
        if (!this.description || this.description == ``) {
            this.description = this.summary;
        }
    }
}

export class TaskType {
    // Meta
    A?: any;
    B?: any;
    C?: any;
    key?: any;
    index?: number;
    count?: number = 1;
    id: string | number | any;
    uuid?: string | number | any;
    type?: string | Views | Types = Views.Task;

    // Relational
    itemID!: number | string;
    listID?: number | string;
    boardID?: number | string;

    // Data
    name: string = ``;
    creator?: string = ``;
    complete?: boolean = false;
    color?: typeof colors | string = colors.mainBG;
    created?: string | Date = new Date().toLocaleString(`en-US`);
    updated?: string | Date = new Date().toLocaleString(`en-US`);
    backgroundColor?: keyof typeof colors | string = colors.mainBG;

    constructor(data: Partial<TaskType>) {
        Object.assign(this, data);
    }
}