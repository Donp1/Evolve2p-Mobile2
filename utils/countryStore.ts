import { CoinPrices } from "@/context";
import { deleteItemAsync, getItemAsync } from "expo-secure-store";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { format, isToday, isYesterday } from "date-fns";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

type Action = {
  id: string;
  type: "transaction" | "swap"; // optional for distinguishing later
  createdAt: string | number; // ensure it's a date or timestamp
  [key: string]: any;
};

export const getAllCountries = async () => {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,idd,flags,cca2"
  );
  return await res.json();
};

export function formatSecretWithDashes(
  secret: string,
  groupSize: number = 4
): string {
  return (
    secret
      .match(new RegExp(".{1," + groupSize + "}", "g")) // split into groups
      ?.join("-")
      .toUpperCase() ?? secret
  );
}

const base_url = "https://evolve2p-backend.onrender.com";

export const sendOtp = async (email: string) => {
  try {
    const res = await fetch(base_url + "/api/send-otp", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const res = await fetch(base_url + "/api/verify-email", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const checkEmailExist = async (email: string) => {
  try {
    const res = await fetch(base_url + "/api/check-email-exist", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const checkUsernamExist = async (username: string) => {
  try {
    const res = await fetch(base_url + "/api/check-username-exist", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const createUser = async (user: {
  email: string;
  password: string;
  country: string | undefined;
  phone: string;
  username: string;
  emailVerified: boolean;
}) => {
  try {
    const res = await fetch(base_url + "/api/auth/register", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const login = async (user: { email: string; password: string }) => {
  try {
    const res = await fetch(base_url + "/api/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const updateUser = async (user: any) => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }
    const res = await fetch(base_url + "/api/update-user", {
      headers: {
        Authorization: "Bearer " + data?.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      method: "PUT",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const getUser = async () => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }

    const userData = await checkToken(data?.token);

    if (userData?.error) {
      console.log(userData?.message);
      return;
    }

    if (userData?.success) {
      const res = await fetch(base_url + "/api/get-user", {
        headers: {
          Authorization: "Bearer " + data?.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userData.user.email }),
        method: "POST",
        cache: "no-store",
      });
      return await res.json();
    }
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const getCountriesData = async () => {
  try {
    const res = await fetch(base_url + "/api/get-supported-countries");
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }

    const res = await fetch(base_url + "/api/get-user-by-id", {
      headers: {
        Authorization: "Bearer " + data?.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
      method: "POST",
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const checkPin = async (pin: string) => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }

    const userData = await checkToken(data?.token);

    if (userData?.error) {
      return { error: true, message: "Token has expired" };
    }
    const res = await fetch(base_url + "/api/check-pin", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userData.user.email, pin }),
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const forgotPin = async (newPin: string, password: string) => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }

    const res = await fetch(base_url + "/api/reset-pin", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      body: JSON.stringify({ password, newPin }),
      method: "PUT",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const verifySecret = async (pin: string) => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }
    const res = await fetch(base_url + "/api/verify-secrete", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      body: JSON.stringify({ token: pin }),
      method: "POST",
    });

    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const checkToken = async (token: string) => {
  try {
    const res = await fetch(base_url + "/api/check-token", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const forgotPassword = async (email: string, password: string) => {
  try {
    const res = await fetch(base_url + "/api/forgot-password", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      method: "PUT",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }
    const res = await fetch(base_url + "/api/change-password", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
      method: "PUT",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const createOffer = async (
  type: string,
  crypto: string,
  currency: string,
  margin: number,
  paymentMethod: string,
  minLimit: number,
  maxLimit: number,
  paymentTime: string,
  paymentTerms?: string
) => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }
  try {
    const res = await fetch(base_url + "/api/create-offer", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      body: JSON.stringify({
        type,
        crypto,
        currency,
        margin,
        paymentMethod,
        minLimit,
        maxLimit,
        paymentTerms,
        paymentTime,
      }),
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const createTrust = async (trustedId: string) => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }
  try {
    const res = await fetch(base_url + "/api/create-trust", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      body: JSON.stringify({
        trustedId,
      }),
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const getOffers = async (
  params?: Record<string, string | number | (string | number)[]>
) => {
  try {
    // Build query string if params exist
    const queryString = params
      ? "?" +
        Object.entries(params)
          .flatMap(([key, value]) =>
            Array.isArray(value)
              ? value.map(
                  (v) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(
                      String(v)
                    )}`
                )
              : `${encodeURIComponent(key)}=${encodeURIComponent(
                  String(value)
                )}`
          )
          .join("&")
      : "";
    const res = await fetch(`${base_url}/api/get-offers${queryString}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const getUserOffers = async (userId: string) => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }
    const res = await fetch(`${base_url}/api/get-user-offers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      body: JSON.stringify({ userId }),
      method: "POST",
    });

    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const getPaymentMethods = async () => {
  try {
    const res = await fetch(base_url + "/api/get-payment-methods", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const getCoinPrice = async (coinName: string) => {
  const category = "spot"; // or 'linear', 'inverse'
  const quoteCurrency = "USDT"; // can also be 'USD', 'ETH', etc.

  const symbol = `${coinName.toUpperCase()}${quoteCurrency}`;

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd`
    );
    const data = await res.json();
    const price = data[coinName].usd;
    return { price };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
};

export function getUsdValue(coinAmount: number, coinPrice: number) {
  // if (coinAmount < 0 || coinPrice <= 0) {
  //   throw new Error("Invalid input values.");
  // }
  return parseFloat((coinAmount * coinPrice).toFixed(2));
}

export const getInquiryId = async () => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }
    const res = await fetch(base_url + "/api/kyc-get-link", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const getVerificationStatus = async (id: string) => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }
    const res = await fetch(base_url + "/api/kyc-verification", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      method: "POST",
      body: JSON.stringify({ inquiry_id: id }),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const deleteAccount = async () => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }
    const res = await fetch(base_url + "/api/delete-account", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      method: "POST",
      // body: JSON.stringify({ inquiry_id: id }),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const generate2fa = async () => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }
    const res = await fetch(base_url + "/api/generate-secrete", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      method: "POST",
    });

    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const sendCrypto = async (
  coin: string,
  amount: number,
  address: string
) => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }
    const res = await fetch(base_url + "/api/send", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      body: JSON.stringify({ coin, amount, toAddress: address }),
      method: "POST",
    });
    const resData = await res.json();
    console.log(resData);
    return resData;
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const getConversionRate = async (from: string, to: string) => {
  try {
    const idsMap = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      USDC: "usd-coin",
    };

    const fromId = idsMap[from as keyof typeof idsMap];
    const toId = idsMap[to as keyof typeof idsMap];

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromId},${toId}&vs_currencies=usd,${toId}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
    return;

    const rate = data[fromId]?.[toId.toLowerCase()];
    const toCoinUsd = data[toId]?.usd;

    return { rate, toCoinUsd };
  } catch (err) {
    console.error("Conversion Error", err);
    return { rate: null, toCoinUsd: null };
  }
};

export const getLiveRate = async (
  fromSymbol: string,
  toSymbol: string,
  data: any
) => {
  const symbolToId = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    USDC: "usd-coin",
  };

  // let fromId, toId;

  const fromId = symbolToId[fromSymbol as keyof typeof symbolToId];
  const toId = symbolToId[toSymbol as keyof typeof symbolToId];

  if (!fromId || !toId) {
    throw new Error("Unsupported currency symbol");
  }

  // Convert fromSymbol to USD, then USD to toSymbol
  const fromToUSD = data[fromId]?.usd;
  const toToUSD = data[toId]?.usd;

  if (!fromToUSD || !toToUSD) {
    throw new Error("Missing rate data");
  }

  const rate = fromToUSD / toToUSD;
  return rate;
};

export const convertCurrency = async (
  amount: string,
  fromSymbol: string,
  toSymbol: string,
  rate: number
) => {
  if (fromSymbol === toSymbol) return amount;

  // const rate = await getLiveRate(fromSymbol, toSymbol);
  return Number((Number(amount) * rate).toFixed(8)); // rounding to 8 decimal places
};

export function formatWalletAddress(
  address: string,
  startLength = 10,
  endLength = 8
) {
  if (!address || address.length <= startLength + endLength) return address;

  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);
  return `${start}...${end}`;
}

export const swapToken = async (
  fromCoin: string,
  toCoin: String,
  fromAmount: string
) => {
  try {
    const token = await getItemAsync("authToken");
    let data;
    if (token) {
      data = JSON.parse(token);
    }

    const res = await fetch(base_url + "/api/swap", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      body: JSON.stringify({ fromCoin, toCoin, fromAmount }),
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const getRecentActions = (user: any): Action[] => {
  const transactions = (user?.transactions || []).map((tx: any) => ({
    ...tx,
    section: "transaction",
  }));

  const swaps = (user?.swaps || []).map((swap: any) => ({
    ...swap,
    section: "swap",
  }));

  const combined = [...transactions, ...swaps];

  return combined
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10); // ✅ Get latest 10
};

const POLL_INTERVAL = 10000; // 10 seconds

export const useUserPolling = (fetchUserData: () => Promise<void>) => {
  const appState = useRef(AppState.currentState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const startPolling = () => {
      fetchUserData(); // fetch immediately
      stopPolling(); // ensure no duplicates
      intervalRef.current = setInterval(fetchUserData, POLL_INTERVAL);
    };

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current !== "active" && nextAppState === "active") {
        startPolling();
      } else if (nextAppState !== "active") {
        stopPolling();
      }
      appState.current = nextAppState;
    };

    // Start polling initially
    startPolling();

    // Listen for app state changes
    const sub = AppState.addEventListener("change", handleAppStateChange);

    // Cleanup on unmount
    return () => {
      stopPolling();
      sub.remove();
    };
  }, [fetchUserData]);
};

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 2) + "...";
}

// utils/getCurrencyUSDPrice.js

export async function getCurrencyUSDPrice(currencyCode: string) {
  try {
    if (!currencyCode || typeof currencyCode !== "string") {
      throw new Error("Invalid currency code");
    }

    const code = currencyCode.trim().toUpperCase();

    // If already USD, no API request needed
    if (code === "USD") return 1;

    // Fetch all rates with USD as base
    const response = await fetch("https://open.er-api.com/v6/latest/USD");

    if (!response.ok) throw new Error("Failed to fetch exchange rates");

    const data = await response.json();

    if (!data?.rates?.[code]) {
      throw new Error(`No exchange rate found for currency: ${code}`);
    }

    // Since base is USD, we need the inverse to get USD price of currencyCode
    const rate = data.rates[code];
    return rate; // USD value of 1 currencyCode
  } catch (error) {
    console.error("getCurrencyUSDPrice Error:", error);
    return null; // Safe fallback
  }
}

// utils/getCryptoPriceWithMargin.js
export const getCryptoPriceWithMargin = async (
  coin: string,
  marginPercent: number
) => {
  try {
    const symbolMap = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      USDC: "usd-coin",
    };

    const coinId = symbolMap[coin.toUpperCase() as keyof typeof symbolMap];
    if (!coinId) throw new Error("Unsupported coin symbol");

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    if (!response.ok) throw new Error("Failed to fetch crypto price");

    const data = await response.json();
    const price = data[coinId]?.usd;
    if (!price) throw new Error("Invalid price data");

    // Apply margin
    const finalPrice = price + (price * marginPercent) / 100;
    return finalPrice;
  } catch (error) {
    console.error("Error fetching crypto price with margin:", error);
    return null;
  }
};

// utils/formatNumber.js
export const formatNumber = (num: number, decimals = 2) => {
  if (num === null || num === undefined || isNaN(num)) return "0.00";

  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// utils/convertCrypto.ts

export async function convertCryptoToCurrency(
  crypto: string,
  amount: number,
  currency: string
): Promise<number> {
  const COINGECKO_IDS: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    USDC: "usd-coin",
  };
  try {
    const coinId = COINGECKO_IDS[crypto.toUpperCase()];
    if (!coinId) throw new Error("Unsupported crypto");

    // Step 1: Fetch crypto price in USD
    const priceResp = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    const priceData = await priceResp.json();
    const usdPrice = priceData[coinId]?.usd;
    if (!usdPrice) throw new Error("Failed to fetch crypto price");

    // Step 2: If target currency is USD, return directly
    if (currency.toUpperCase() === "USD") {
      return amount * usdPrice;
    }

    // Step 3: Fetch conversion rates (USD → target currency)
    const rateResp = await fetch("https://open.er-api.com/v6/latest/USD");
    const rateData = await rateResp.json();
    const rate = rateData.rates?.[currency.toUpperCase()];
    if (!rate) throw new Error("Currency not supported");

    return amount * usdPrice * rate;
  } catch (err: any) {
    console.error("Conversion error:", err.message);
    return 0;
  }
}

type Cache<T> = { value: T; at: number };
const TTL_MS = 60_000; // 1 minute cache

const fxCache: Record<string, Cache<number>> = {};
const priceCache: Record<string, Cache<number>> = {};

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  USDC: "usd-coin",
};

async function getUsdPrice(crypto: string): Promise<number> {
  const sym = crypto.toUpperCase();
  const id = COINGECKO_IDS[sym];
  if (!id) throw new Error("Unsupported crypto");

  // Stablecoins: treat as $1 to avoid minor oracle noise
  if (sym === "USDT" || sym === "USDC") return 1;

  const cached = priceCache[id];
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;

  const resp = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
  );
  const data = await resp.json();
  const usd = data?.[id]?.usd;
  if (typeof usd !== "number" || usd <= 0)
    throw new Error("Failed to fetch coin price");

  priceCache[id] = { value: usd, at: Date.now() };

  return usd;
}

async function getUsdToCurrencyRate(code: string): Promise<number> {
  const c = code.toUpperCase();
  const cached = fxCache[c];
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;

  // Base = USD. We need: 1 USD -> X targetCurrency
  const resp = await fetch(`https://open.er-api.com/v6/latest/USD`);
  const data = await resp.json();
  // Open ER-API uses "conversion_rates"
  const table = data?.rates ?? data?.conversion_rates;
  const rate = table?.[c];

  if (typeof rate !== "number" || rate <= 0)
    throw new Error(`Currency not supported: ${c}`);

  fxCache[c] = { value: rate, at: Date.now() };
  return rate;
}

export async function convertCurrencyToCrypto(
  crypto: string,
  amount: number,
  currency: string
): Promise<number> {
  if (!Number.isFinite(amount) || amount <= 0) return 0;

  const usdPrice = await getUsdPrice(crypto);
  const cur = currency.toUpperCase();

  // If fiat is already USD, just divide by the coin USD price
  if (cur === "USD") {
    return Number((amount / usdPrice).toFixed(8));
  }

  // Convert fiat -> USD: with base USD, 1 USD = rate targetCurrency
  // So amount(target) -> USD = amount / rate
  const usdToCur = await getUsdToCurrencyRate(cur);
  const amountInUSD = amount / usdToCur;

  return Number((amountInUSD / usdPrice).toFixed(8));
}

type Balance = {
  crypto: "BTC" | "ETH" | "USDT" | "USDC";
  amount: number;
};

export async function getTotalBalanceInCurrency(
  balances: Balance[],
  currency: string
): Promise<number> {
  try {
    const conversions = await Promise.all(
      balances.map((b) => convertCryptoToCurrency(b.crypto, b.amount, currency))
    );

    return conversions.reduce((acc, val) => acc + val, 0);
  } catch (err: any) {
    console.error("Error calculating total:", err.message);
    return 0;
  }
}

// utils/fetchPrices.ts
export async function fetchPrices(
  currency: string
): Promise<Record<string, number>> {
  const COINGECKO_IDS: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    USDC: "usd-coin",
  };

  try {
    // Step 1: Fetch all crypto prices in USD
    const ids = Object.values(COINGECKO_IDS).join(",");
    const priceResp = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );
    const priceData = await priceResp.json();

    // Step 2: If currency is USD, return directly
    if (currency.toUpperCase() === "USD") {
      const prices: Record<string, number> = {};
      for (const [symbol, id] of Object.entries(COINGECKO_IDS)) {
        prices[symbol] = priceData[id]?.usd ?? 0;
      }
      return prices;
    }

    // Step 3: Fetch conversion rates (USD → target currency)
    const rateResp = await fetch("https://open.er-api.com/v6/latest/USD");
    const rateData = await rateResp.json();
    const rate = rateData.rates?.[currency.toUpperCase()];
    if (!rate) throw new Error("Currency not supported");

    // Step 4: Apply conversion to all cryptos
    const prices: Record<string, number> = {};
    for (const [symbol, id] of Object.entries(COINGECKO_IDS)) {
      const usdPrice = priceData[id]?.usd ?? 0;
      prices[symbol] = usdPrice * rate;
    }

    return prices;
  } catch (err: any) {
    console.error("Fetch prices error:", err.message);
    return {};
  }
}

// utils/formatNumber.ts
export function priceFormater(
  value: number,
  options: { style?: "currency" | "short" | "standard"; currency?: string } = {}
): string {
  const { style = "standard", currency = "USD" } = options;

  if (isNaN(value)) return "0";

  // Short scale formatting (e.g., 1.2M, 4.5B)
  if (style === "short") {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(2) + "K";
    return value.toFixed(2);
  }

  // Currency formatting
  if (style === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // Standard formatting with commas
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export const createTrade = async (
  offerId: string,
  amountFiat: number,
  amountCrypto: number,
  tradePrice: number
) => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }
  try {
    const res = await fetch(base_url + "/api/create-trade", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },
      body: JSON.stringify({
        offerId,
        amountFiat,
        amountCrypto,
        tradePrice,
      }),
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getTrade = async (tradeId: string) => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }
  try {
    const res = await fetch(base_url + "/api/get-trade/" + tradeId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },

      method: "GET",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getSettings = async () => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }
  try {
    const res = await fetch(base_url + "/api/admin/settings", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },

      method: "GET",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const markAsPaid = async (tradeId: string) => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }
  try {
    const res = await fetch(base_url + "/api/mark-trade-as-paid/" + tradeId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },

      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const releaseCrypto = async (tradeId: string) => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }
  try {
    const res = await fetch(base_url + "/api/release-trade/" + tradeId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },

      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const cancelTrade = async (tradeId: string) => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }
  try {
    const res = await fetch(base_url + "/api/cancle-trade/" + tradeId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },

      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const openDispute = async (
  reason: string,
  tradeId: string,
  evidence: any,
  description?: string
) => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }
  try {
    const formData = new FormData();
    formData.append("tradeId", tradeId);
    formData.append("reason", reason);
    if (description) {
      formData.append("description", description);
    }
    if (evidence) {
      const fileName =
        evidence.name || evidence.fileName || `evidence-${Date.now()}`;
      formData.append("evidence", {
        uri: evidence.uri,
        type: evidence.mimeType || evidence.type || "application/octet-stream",
        name: fileName,
      } as any);
    }

    const res = await fetch(base_url + "/api/open-dispute", {
      headers: {
        Authorization: "Bearer " + data?.token,
      },
      body: formData,
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const getChats = async (chatId: string) => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }
  try {
    const res = await fetch(base_url + "/api/get-chats/" + chatId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data?.token,
      },

      method: "GET",
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

export const sendChat = async (
  chatId: string,
  content?: string,
  file?: any // optional attachment
) => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }

  try {
    const formData = new FormData();
    formData.append("chatId", chatId);

    if (content) {
      formData.append("content", content);
    }

    if (file) {
      const fileName = file.name || file.fileName || `upload-${Date.now()}`;
      formData.append("attachment", {
        uri: file.uri,
        type: file.mimeType || file.type || "application/octet-stream",
        name: fileName,
      } as any);
    }

    const res = await fetch(`${base_url}/api/send-chat`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + data?.token,
        // don't manually set Content-Type → fetch will handle it with FormData
      },
      body: formData,
    });

    return await res.json();
  } catch (error) {
    console.log("sendChat error:", error);
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      return {
        error: true,
        message:
          "Network connection failed. Please check your internet and try again or restart the app.",
      };
    }
  }
};

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string | Date;
  [key: string]: any; // allow extra fields
};

export function groupNotificationsByDate(notifications: Notification[]) {
  const groups: Record<string, Notification[]> = {};

  notifications.forEach((n) => {
    const date = new Date(n.createdAt);

    let label: string;
    if (isToday(date)) {
      label = "Today";
    } else if (isYesterday(date)) {
      label = "Yesterday";
    } else {
      label = format(date, "MMMM d, yyyy");
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(n);
  });

  // 🔑 Convert to array and ensure Today/Yesterday come first
  const orderedLabels = Object.keys(groups).sort((a, b) => {
    if (a === "Today") return -1;
    if (b === "Today") return 1;
    if (a === "Yesterday") return -1;
    if (b === "Yesterday") return 1;
    return 0;
  });

  return orderedLabels.map((label) => ({
    label,
    notifications: groups[label],
  }));
}

export async function registerForPushNotificationsAsync() {
  let finalStatus;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for notifications!");
      return;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return finalStatus === "granted";
}
