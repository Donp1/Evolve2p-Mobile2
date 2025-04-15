import { create } from "zustand";

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

export const useCoins = create<CoinState>((set) => ({
  coins: [],
  setCoin: (
    newCoins: { symbol: string; image: string; price: string; name: string }[]
  ) => set({ coins: newCoins }),
}));
