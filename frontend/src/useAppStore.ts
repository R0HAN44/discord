import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Channel, ChannelType } from "./lib/utils";
import { io as ClientIO } from "socket.io-client";

export type ModalType = "createServer" | "invite" | "editserver" | "members" | "createChannel" 
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

interface ModalStore {
  type : ModalType | null;
  isOpen: boolean;
  data: any;
  channel: any;
  channelType: ChannelType;
  setChannel: (channel : Channel) => void;
  setChannelType: (channelType : ChannelType) => void;
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
  activeChannel: any;
  activeMember: any;
  socket: any | null;
  isConnected: boolean;
  connectSocket: () => void;
  disconnectSocket: () => void;
  sendSocketEvent: (event: string, data?: any) => void;
  setUser: (user: { id: string; name: string; email: string; imageUrl?: string } | null) => void;
  setServers: (servers: { id: string; name: string; imageUrl?: string; inviteCode: string,createdAt?: Date; updatedAt?: Date,profileId:string,channels: any[],members: any[], }[]) => void;
  setActiveMember: (member: any) => void;
  setActiveServer: (server: { id: string; name: string; imageUrl?: string; inviteCode: string;createdAt?: Date; updatedAt?: Date,profileId:string,channels: any[],members: any[],}) => void;
  setActiveChannel: (channel: any) => void;
}

// Zustand store
const useAppStore = create<AppState>()(
  devtools((set, get) => {
    let socketInstance: any = null;

    return {
      user: null,
      servers: [],
      activeServer: null,
      activeChannel: null,
      activeMember: null,
      socket: null,
      isConnected: false,

      // Connect Socket
      connectSocket: () => {
  if (!socketInstance) {
    socketInstance = ClientIO(import.meta.env.VITE_API_BASE_URL || "http://localhost:8000", {
      path: "/api/socket/io",
      transports: ["polling", "websocket"], // Start with polling, then upgrade
      withCredentials: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true,
    });

    socketInstance.on("connect_error", (err:any) => {
      console.log("Connection error details:", {
        message: err.message,
        description: err.description,
        type: err.type,
        transport: socketInstance.io.engine.transport.name
      });
    });

    socketInstance.io.on("error", (error:any) => {
      console.log("Transport error:", error);
    });

    socketInstance.io.on("reconnect_attempt", (attempt:any) => {
      console.log("Reconnection attempt:", attempt);
    });

    socketInstance.on("connect", () => {
      console.log("Connected successfully!");
      console.log("Transport used:", socketInstance.io.engine.transport.name);
      set({ isConnected: true, socket: socketInstance });
    });

    socketInstance.on("disconnect", (reason:any) => {
      console.log("Disconnected because:", reason);
      set({ isConnected: false, socket: null });
    });

    set({ socket: socketInstance });
  }
},

      // Disconnect Socket
      disconnectSocket: () => {
        if (socketInstance) {
          socketInstance.disconnect();
          socketInstance = null;
          set({ isConnected: false, socket: null });
        }
      },

      // Emit event via Socket.io
      sendSocketEvent: (event: string, data?: any) => {
        const socket = get().socket;
        if (socket) {
          socket.emit(event, data);
        }
      },

      setUser: (user) => set({ user }),
      setServers: (servers) => set({ servers }),
      setActiveMember: (member) => set({ activeMember: member }),
      setActiveServer: (server) => set({ activeServer: server }),
      setActiveChannel: (channel) => set({ activeChannel: channel }),
    };
  })
);

export const useModal = create<ModalStore>((set)=>({
  type:null,
  isOpen : false,
  data : {},
  channel: {},
  channelType: ChannelType.TEXT,
  setChannel: (channel : Channel) => set({channel}),
  setChannelType: (channelType : ChannelType) => set({channelType}),
  onOpen : (type, dialogTriggerButton, data = {}) => set({isOpen:true,dialogTriggerButton,type, data}),
  onClose: () => set({type:null, isOpen:false}),
  dialogTriggerButton : false,
  setDialogTriggerButton: (dialogTriggerButton : boolean) => set({ dialogTriggerButton }),
}));

export default useAppStore;
