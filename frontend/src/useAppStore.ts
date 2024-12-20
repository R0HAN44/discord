import { create } from "zustand";
import { devtools } from "zustand/middleware";

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
    updatedAt?: Date
  } | null;
  activeChannel: {
    id: string;
    name: string;
    type: "TEXT" | "AUDIO" | "VIDEO";
  } | null;
  setUser: (user: { id: string; name: string; email: string; imageUrl?: string } | null) => void;
  setServers: (servers: { id: string; name: string; imageUrl?: string; inviteCode: string }[]) => void;
  setActiveServer: (server: { id: string; name: string; imageUrl?: string; inviteCode: string;createdAt?: Date; updatedAt?: Date } | null) => void;
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

export default useAppStore;
