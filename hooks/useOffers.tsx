import { getOffers } from "@/utils/countryStore";
import { useEffect, useState } from "react";

export interface Offer {
  id: string;
  type: string;
  crypto: string;
  currency: string;
  margin: number;
  minLimit: number;
  maxLimit: number;
  status: string;
  time: number;
  createdAt: string;
  basePrice: number;
  finalPrice: number;
  user: {
    id: string;
    username: string;
  };
  paymentMethod: {
    id: string;
    name: string;
  };
}

// Metadata for pagination
export interface OfferMeta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

// The API response wrapper
export interface OfferResponse {
  data: Offer[];
  meta: OfferMeta;
}

type ParamValue = string | number | (string | number)[];
type Params = Record<string, ParamValue>;

export const useOffers = (params?: Params) => {
  const [offers, setOffers] = useState<OfferResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOffers = async () => {
      try {
        setLoading(true);
        // const data = await getOffers();

        const data = await getOffers(params);
        if (isMounted) {
          setOffers(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch offers");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOffers();

    return () => {
      isMounted = false; // prevent state update after unmount
    };
  }, [JSON.stringify(params)]); // refetch when params change

  return { offers, loading, error };
};
