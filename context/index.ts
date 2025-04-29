import { create } from "zustand";
import { persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';


// Custom storage wrapper for expo-secure-store
const secureStoreStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name: string, value: any) => {
    await SecureStore.setItemAsync(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export interface CountryDataProp {
  name: string;
  flag: string;
  phoneCode?: string;
  abbrev: any;
}

export interface BearState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
}
export interface CoinState {
  coins: { symbol: string; image: string; price: string; name: string }[];
  setCoin: (
    newCoin: { symbol: string; image: string; price: string; name: string }[]
  ) => void;
}

type LoadingState = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));


export const useCoins = create<CoinState>((set) => ({
  coins: [],
  setCoin: (
    newCoins: { symbol: string; image: string; price: string; name: string }[]
  ) => set({ coins: newCoins })
    
}));
