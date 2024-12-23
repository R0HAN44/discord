import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ModalType = "createServer" | "invite" | "editserver" | "members" | "createChannel" | "leaveServer" | "deleteServer";

interface ModalStore {
  type : ModalType | null;
  isOpen: boolean;
  data: any;
  onOpen: (type:ModalType, dialogTriggerButton:boolean, data?: any) => void;
  onClose: ()=>void;
  dialogTriggerButton: boolean;
  setDialogTriggerButton: (dialogTriggerButton : boolean) => void;
}


// Define the state interface
interface AppState {
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
  } | null;
  servers: {
    id: string;
    name: string;
    imageUrl?: string;
    inviteCode: string;
    createdAt?: Date,
    updatedAt?: Date,
    profileId:string;
    channels: any[];
    members: any[];
  }[];
  activeServer: {
    id: string;
    name: string;
    imageUrl?: string;
    inviteCode: string;
    createdAt?: Date,
    updatedAt?: Date,
    profileId:string;
    channels: any[];
    members: any[];
  };
  activeChannel: {
    id: string;
    name: string;
    type: "TEXT" | "AUDIO" | "VIDEO";
  } | null;
  setUser: (user: { id: string; name: string; email: string; imageUrl?: string } | null) => void;
  setServers: (servers: { id: string; name: string; imageUrl?: string; inviteCode: string,createdAt?: Date; updatedAt?: Date,profileId:string,channels: any[],members: any[], }[]) => void;
  setActiveServer: (server: { id: string; name: string; imageUrl?: string; inviteCode: string;createdAt?: Date; updatedAt?: Date,profileId:string,channels: any[],members: any[],}) => void;
  setActiveChannel: (channel: { id: string; name: string; type: "TEXT" | "AUDIO" | "VIDEO" } | null) => void;
}

// Zustand store
const useAppStore = create<AppState>()(
  devtools((set) => ({
    user: null,
    servers: [],
    activeServer: null,
    activeChannel: null,
    setUser: (user) => set({ user }),
    setServers: (servers) => set({ servers }),
    setActiveServer: (server) => set({ activeServer: server }),
    setActiveChannel: (channel) => set({ activeChannel: channel }),
  }))
);

export const useModal = create<ModalStore>((set)=>({
  type:null,
  isOpen : false,
  data : {},
  onOpen : (type, dialogTriggerButton, data = {}) => set({isOpen:true,dialogTriggerButton,type, data}),
  onClose: () => set({type:null, isOpen:false}),
  dialogTriggerButton : false,
  setDialogTriggerButton: (dialogTriggerButton : boolean) => set({ dialogTriggerButton }),
}));

export default useAppStore;
