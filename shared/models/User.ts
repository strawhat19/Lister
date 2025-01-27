import { capWords } from '../variables';

export enum Providers { 
  Google = `Google` ,
  Firebase = `Firebase`, 
}

export enum UserTypes { 
  Real = `Real` ,
  Simulated = `Simulated`, 
}

export enum Roles {
  Guest = `Guest`,
  Subscriber = `Subscriber`,
  Editor = `Editor`,
  Moderator = `Moderator`,
  Administrator = `Administrator`,
  Developer = `Developer`,
  Owner = `Owner`,
}

export class Role {
  name: any;
  level: number;
  constructor(level: number, role: string) {
    this.name = role;
    this.level = level;
  }
}
  
export const roles = {
  Guest: new Role(1, Roles.Guest),
  Subscriber: new Role(2, Roles.Subscriber),
  Editor: new Role(3, Roles.Editor),
  Moderator: new Role(4, Roles.Moderator),
  Administrator: new Role(5, Roles.Administrator),
  Developer: new Role(6, Roles.Developer),
  Owner: new Role(7, Roles.Owner),
}

export class User {
  A?: any;
  B?: any;
  C?: any;
  uid!: string;
  title?: string;
  id: string = ``;
  userID?: string;
  index?: number = 1;
  uuid?: string = ``;
  email?: string = ``;
  name: string = Roles.Subscriber;

  created?: string | Date = ``;
  updated?: string | Date = ``;

  password?: string = ``;
  boardIDs?: string[] | number[] = [];
  type?: UserTypes | string = UserTypes.Real;
  
  level?: number = roles.Subscriber.level;
  role?: Roles | string = roles.Subscriber.name;
  provider?: Providers | string = Providers.Firebase;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
    let now = new Date().toLocaleString(`en-US`);
    let currentTimeStampNoSpaces = now.replaceAll(` `, `_`).replaceAll(`,`, `_`).replaceAll(`/`, `_`).replaceAll(`:`, `_`);
    if (!this.name || this.name == ``) this.name = capWords(this.email.split(`@`)[0]);
    if (!this.id || this.id == ``) this.id = `${this.index}_User_${this.name}_${currentTimeStampNoSpaces}_${this.uid}`;
    if (!this.created || this.created == ``) this.created = now;
    if (!this.updated || this.updated == ``) this.updated = now;
  }
}