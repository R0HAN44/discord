import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ModalType = "createServer"

interface ModalStore {
  type : ModalType | null;
  isOpen: boolean;
  onOpen: (type:ModalType, dialogTriggerButton:boolean) => void;
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
  }[];
  activeServer: {
    id: string;
    name: string;
    imageUrl?: string;
    inviteCode: string;
    createdAt?: Date,
    updatedAt?: Date,
    profileId?:string;
    channels?: any[];
    members?: any[];
  } | null;
  activeChannel: {
    id: string;
    name: string;
    type: "TEXT" | "AUDIO" | "VIDEO";
  } | null;
  setUser: (user: { id: string; name: string; email: string; imageUrl?: string } | null) => void;
  setServers: (servers: { id: string; name: string; imageUrl?: string; inviteCode: string }[]) => void;
  setActiveServer: (server: { id: string; name: string; imageUrl?: string; inviteCode: string;createdAt?: Date; updatedAt?: Date,profileId?:string,channels?: any[],members?: any[],} | null) => void;
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
  onOpen : (type, dialogTriggerButton) => set({isOpen:true,dialogTriggerButton,type}),
  onClose: () => set({type:null, isOpen:false}),
  dialogTriggerButton : false,
  setDialogTriggerButton: (dialogTriggerButton : boolean) => set({ dialogTriggerButton }),
}));

export default useAppStore;
