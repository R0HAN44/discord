import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function stringToColor(string : string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`; // HSL for unique colors
  return color;
}

export function getInitials(name : string) {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();
}

export enum ChannelType {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export enum MemberRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  GUEST = "GUEST",
}

export interface Profile {
  id       :string ;
  userId   :string;
  name     :string;
  imageUrl :string;
  email   : string ;
  password :string;
  servers :  Server[];
  members : Member[];
  channels :Channel[];
  createdAt: Date;
  updatedAt: Date;
}

export interface  Server {
  id      :   string ;
  name     :  string;
  imageUrl  : string;
  inviteCode :string;
  profileId :string;
  profile   :Profile; 
  members  :Member[];
  channels :Channel[];
  createdAt :Date;
  updatedAt :Date;

}

export interface Member {
  id  : string  ;
  role :MemberRole ;
  profileId: string;
  profile :  Profile ;
  serverId: string;
  server  : Server ;
  createdAt: Date ;
  updatedAt :Date ;

}

export interface Channel {
  id  : string;
  name :string;
  type :ChannelType ;
  profileId :string;
  profile   :Profile;
  serverId :string;
  server   :Server ;
  createdAt :Date;
  updatedAt :Date;
}
