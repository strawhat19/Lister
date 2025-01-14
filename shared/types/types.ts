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
    Details = `Details`,
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
    uuid: string | number;
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
    key?: any;
    index?: number;
    id: string | number;
    type?: string | Views | Types = Views.Board;

    // Relational
    items?: ItemType[] = [];
    columns?: ColumnType[] = [];
    listIDs?: string[] | number[] = [];
    itemIDs?: string[] | number[] = [];

    // Data
    name: string;
    creator?: string = ``;
    boardType?: BoardTypes = BoardTypes.Kanban;
    created?: string | Date = new Date().toLocaleString(`en-US`);
    updated?: string | Date = new Date().toLocaleString(`en-US`);
    backgroundColor?: keyof typeof colors | string = colors.black;

    constructor(data: Partial<BoardType>) {
        Object.assign(this, data);
    }
}

export class ColumnType {
    // Meta
    key?: any;
    index?: number;
    id: string | number;
    type?: string | Views | Types = Views.Column;

    // Relational
    items: ItemType[] = [];
    listID?: string | number;
    boardID?: string | number;
    itemIDs?: string[] | number[] = [];

    // Data
    name: string;
    category: string;
    creator?: string = ``;
    created?: string | Date = new Date().toLocaleString(`en-US`);
    updated?: string | Date = new Date().toLocaleString(`en-US`);
    backgroundColor?: keyof typeof colors | string = colors.background;

    constructor(data: Partial<ColumnType>) {
        Object.assign(this, data);
    }
}

export class ItemType {
    // Meta
    key?: any;
    index?: number;
    id: string | number;
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
    orientation?: Orientations = Orientations.Portrait;
    created?: string | Date = new Date().toLocaleString(`en-US`);
    updated?: string | Date = new Date().toLocaleString(`en-US`);
    backgroundColor?: keyof typeof colors | string = colors.appleBlue;
    
    constructor(data: Partial<ItemType>) {
        Object.assign(this, data);
        if (!this.description || this.description == ``) {
            this.description = this.summary;
        }
    }
}

export class TaskType {
    // Meta
    key?: any;
    index?: number;
    id: string | number;
    type?: string | Views | Types = Views.Task;

    // Relational
    itemID?: number | string;
    listID?: number | string;
    boardID?: number | string;

    // Data
    name: string = ``;
    creator?: string = ``;
    created?: string | Date = new Date().toLocaleString(`en-US`);
    updated?: string | Date = new Date().toLocaleString(`en-US`);
    backgroundColor?: keyof typeof colors | string = colors.black;

    constructor(data: Partial<TaskType>) {
        Object.assign(this, data);
    }
}