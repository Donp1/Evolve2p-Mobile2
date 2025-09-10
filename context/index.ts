import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

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

export interface CoinPrices {
  [coinId: string]: {
    usd: number;
    btc: number;
    eth: number;
  };
}

export interface CoinPriceState {
  prices: CoinPrices | null;
  setPrices: (data: CoinPrices) => void;
  fetchPrices: () => Promise<void>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: string; // e.g. TRADE, CHAT, SYSTEM
  data?: any;
  read: boolean;
  createdAt: string;
}

type LoadingState = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

const COIN_IDS = {
  btc: "btc-bitcoin",
  eth: "eth-ethereum",
  usdt: "usdt-tether",
  usdc: "usdc-usd-coin",
};

export type CoinData = {
  symbol: string;
  name: string;
  price: number;
  image: string;
};

type CoinStore = {
  coins: CoinData[];
  loading: boolean;
  error: string | null;
  fetchCoins: () => Promise<void>;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useCoins = create<CoinState>((set) => ({
  coins: [],
  setCoin: (
    newCoins: { symbol: string; image: string; price: string; name: string }[]
  ) => set({ coins: newCoins }),
}));

export const useCoinPriceStore = create<CoinPriceState>((set) => ({
  prices: null,

  setPrices: (data) => set({ prices: data }),
  fetchPrices: async () => {
    const symbolToId = {
      bitcoin: "btc-bitcoin",
      ethereum: "eth-ethereum",
      tether: "usdt-tether",
      "usd-coin": "usdc-usd-coin",
    };

    try {
      // Step 1: Fetch USD prices for all coins from CoinPaprika
      const entries = await Promise.all(
        Object.entries(symbolToId).map(async ([key, id]) => {
          const res = await fetch(
            `https://api.coinpaprika.com/v1/tickers/${id}`
          );
          const data = await res.json();
          return [key, parseFloat(data.quotes.USD.price)];
        })
      );

      const usdPrices = Object.fromEntries(entries);

      // Step 2: Calculate BTC and ETH rates
      const btcPrice = usdPrices.bitcoin;
      const ethPrice = usdPrices.ethereum;

      const formattedPrices: Record<
        string,
        { usd: number; btc: number; eth: number }
      > = {};

      for (const key in usdPrices) {
        const usd = usdPrices[key];
        formattedPrices[key] = {
          usd: usd,
          btc: parseFloat((usd / btcPrice).toFixed(8)),
          eth: parseFloat((usd / ethPrice).toFixed(8)),
        };
      }

      // Set 1 for base units
      formattedPrices.bitcoin.btc = 1;
      formattedPrices.ethereum.eth = 1;

      // Step 3: Update state
      // return { prices: formattedPrices };
      set({ prices: formattedPrices });
    } catch (error) {
      console.error("Failed to fetch coin prices", error);
    }
  },

  // fetchPrices: async () => {
  //   try {
  //     const res = await fetch(
  //       "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd,btc,eth"
  //     );
  //     const data = await res.json();
  //     set({ prices: data });
  //   } catch (error) {
  //     console.error("Failed to fetch coin prices", error);
  //   }
  // },
}));

export const useCoinStore = create<CoinStore>((set) => ({
  coins: [],
  loading: false,
  error: null,

  fetchCoins: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch("https://api.coinpaprika.com/v1/tickers");
      const data = await res.json();

      const coins: CoinData[] = Object.entries(COIN_IDS).map(([symbol, id]) => {
        const coin = data.find((item: any) => item.id === id);
        if (!coin) throw new Error(`Coin ${id} not found`);
        return {
          symbol: coin.symbol.toLowerCase(),
          name: coin.name,
          price: coin.quotes.USD.price,
          image: `https://static.coinpaprika.com/coin/${coin.id}/logo.png`,
        };
      });

      set({ coins, loading: false });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Failed to fetch coins", loading: false });
    }
  },
}));

type NotificationState = {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  // Initialize with notifications (e.g. from user data)
  setNotifications: (notifications) => set({ notifications }),

  // Add a new notification (e.g. from socket)
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  // Mark a notification as read
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  // Clear all notifications (optional, e.g. on logout)
  clearNotifications: () => set({ notifications: [] }),
}));
