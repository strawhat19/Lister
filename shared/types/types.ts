import { colors } from '@/components/theme/Themed';

export type Type = {
    type: Types; 
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

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
}

export enum SheetComponents {
    Item = `Item`,
    Column = `Column`,
    Confirm = `Confirm`,
    ItemForm = `Item Form`,
}

export class ItemViewType {
    selected: ItemType | null;
    backgroundColor?: keyof typeof colors | string = `appleBlue`;
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
}

export class ColumnType {
    id: any;
    listID: any;
    name: string;
    index: number;
    category: string;
    items: ItemType[];
    type?: string | SheetComponents = SheetComponents.Column;
}

export class ItemType {
    id: any;
    key: any;
    image?: any;
    listID!: any;
    name: string = ``;
    fontColor?: string;
    summary: string = ``;
    description: string = ``;
    type?: string | SheetComponents = SheetComponents.Item;
    backgroundColor?: keyof typeof colors | string = `appleBlue`;
    constructor(data: Partial<ItemType>) {
        Object.assign(this, data);
        if (!this.description || this.description == ``) {
            this.description = this.summary;
        }
    }
}