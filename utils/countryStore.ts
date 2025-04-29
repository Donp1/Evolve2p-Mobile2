import { getItemAsync } from "expo-secure-store";

export const getAllCountries = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  return await res.json();
};

const base_url = "https://evolve2p-backend.onrender.com";

export const sendOtp = async (email: string) => {
  const res = await fetch(base_url + "/api/send-otp", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    method: "POST",
  });
  return await res.json();
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await fetch(base_url + "/api/verify-email", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
    method: "POST",
  });
  return await res.json();
};

export const checkEmailExist = async (email: string) => {
  const res = await fetch(base_url + "/api/check-email-exist", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    method: "POST",
  });
  return await res.json();
};

export const checkUsernamExist = async (username: string) => {
  const res = await fetch(base_url + "/api/check-username-exist", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
    method: "POST",
  });
  return await res.json();
};

export const createUser = async (user: {
  email: string;
  password: string;
  country: string | undefined;
  phone: string;
  username: string;
}) => {
  const res = await fetch(base_url + "/api/auth/register", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    method: "POST",
  });
  return await res.json();
};

export const login = async (user: { email: string; password: string }) => {
  const res = await fetch(base_url + "/api/auth/login", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    method: "POST",
  });
  return await res.json();
};

export const updateUser = async (user: any) => {
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
};

export const getUser = async (email: string) => {
  const token = await getItemAsync("authToken");
  let data;
  if (token) {
    data = JSON.parse(token);
  }
  const res = await fetch(base_url + "/api/get-user", {
    headers: {
      Authorization: "Bearer " + data?.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    method: "POST",
  });
  return await res.json();
};

export const checkToken = async (token: string) => {
  const res = await fetch(base_url + "/api/check-token", {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  return await res.json();
};

export const forgotPassword = async (email: string, password: string) => {
  const res = await fetch(base_url + "/api/forgot-password", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    method: "PUT",
  });
  return await res.json();
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
  }
};
