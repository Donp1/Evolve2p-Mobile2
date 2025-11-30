import { create } from "zustand";

export interface Country {
  name: {
    common: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  currencies?: {
    [code: string]: {
      name: string;
      symbol: string;
    };
  };
  cca2: string;
}

interface SelectedCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface CountryStore {
  countries: Country[];
  loading: boolean;
  error: string | null;
  fetchCountries: () => Promise<void>;
  fetchCurrencyDetails: (
    currencyCode: string
  ) => Promise<SelectedCurrency | null>;
}

export const useCountryStore = create<CountryStore>((set, get) => ({
  countries: [],
  loading: false,
  error: null,

  fetchCountries: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags,currencies,cca2"
      );
      const data = await res.json();

      set({ countries: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to load", loading: false });
    }
  },

  fetchCurrencyDetails: async (
    query: string
  ): Promise<SelectedCurrency | null> => {
    try {
      if (!query) return null;

      const data = get().countries;
      const withCurrency = data.filter((c) => c.currencies);

      const upperQuery = query.toUpperCase();

      // Special case: USD → always pick United States
      if (upperQuery === "USD") {
        const usa = withCurrency.find(
          (c) => c.cca2 === "US" && c.currencies?.USD
        );
        if (usa?.currencies?.USD) {
          return {
            code: "USD",
            name: usa.currencies.USD.name,
            symbol: usa.currencies.USD.symbol,
            flag: usa.flags.png,
          };
        }
      }

      // 1️⃣ Check if query matches a country code (cca2)
      const byCountryCode = withCurrency.find((c) => c.cca2 === upperQuery);
      if (byCountryCode) {
        const firstCurrencyCode = Object.keys(byCountryCode.currencies!)[0];
        const currency = byCountryCode.currencies![firstCurrencyCode];
        return {
          code: firstCurrencyCode,
          name: currency.name,
          symbol: currency.symbol,
          flag: byCountryCode.flags.png,
        };
      }

      // 2️⃣ Check if query matches a currency code
      const byCurrencyCode = withCurrency.find(
        (c) => c.currencies?.[upperQuery]
      );
      if (byCurrencyCode) {
        const currency = byCurrencyCode.currencies![upperQuery];
        return {
          code: upperQuery,
          name: currency.name,
          symbol: currency.symbol,
          flag: byCurrencyCode.flags.png,
        };
      }

      // 3️⃣ Check if query matches a country name
      const byCountryName = withCurrency.find(
        (c) => c.name.common.toLowerCase() === query.toLowerCase()
      );
      if (byCountryName) {
        const firstCurrencyCode = Object.keys(byCountryName.currencies!)[0];
        const currency = byCountryName.currencies![firstCurrencyCode];
        return {
          code: firstCurrencyCode,
          name: currency.name,
          symbol: currency.symbol,
          flag: byCountryName.flags.png,
        };
      }

      // Not found
      return null;
    } catch (e) {
      console.error("Error fetching currency details:", e);
      return null;
    }
  },
}));
