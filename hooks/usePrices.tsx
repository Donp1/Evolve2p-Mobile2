import { useQuery } from "@tanstack/react-query";
import { base_url } from "@/utils/countryStore";

export const usePrices = (currencyCode?: string) => {
  return useQuery({
    queryKey: ["prices", currencyCode?.toUpperCase()],
    queryFn: async () => {
      const res = await fetch(
        `${base_url}/api/get-prices/${currencyCode?.toUpperCase()}`
      );
      const json = await res.json();

      if (!json?.success) {
        throw new Error("Failed to fetch prices");
      }

      const prices: Record<string, number> = {};

      Object.keys(json.prices).forEach((coin) => {
        prices[coin.toUpperCase()] =
          json.prices[coin]?.[currencyCode?.toUpperCase() as string] ?? 0;
      });

      return prices;
    },

    enabled: !!currencyCode, // only run if currency is set
    staleTime: 1000 * 60, // 1 min
    refetchInterval: 1000 * 30, // refresh every 30s
    retry: 3, // retry automatically
  });
};
