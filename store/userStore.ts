import { create } from "zustand";

interface User {
  user: any;
  setUser: (user: any) => void;
}
export const useUserStore = create<User>((set) => ({
  user: null,
  setUser: (user: any) => set({ user }),
}));
