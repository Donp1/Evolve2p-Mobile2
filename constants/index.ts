import { createClient } from "@supabase/supabase-js";

export const colors = {
  primary: "#0F1012",
  secondary: "#DBDBDB",
  gray: "#4A4A4A",
  gray2: "#2D2D2D",
  gray3: "#8F8F8F",
  gray4: "#C7C7C7",
  white: "#8F8F8F",
  white2: "#FCFCFC",
  accent: "#4DF2BE",
  red: "#F5918A",
};

export const contents = [
  {
    heading: "Secure & Fast \nCrypto Trading",
    text: "Trade Bitcoin, USDT, and more with verified \nusers worldwide in a secure peer-to-peer \nmarketplace.",
    image: require("@/assets/images/front2.webp"),
  },
  {
    heading: "300+ Payment Methods",
    text: "Bank transfer, mobile money, gift cards, and 300+ ways to pay—seamlessly integrated for fast transactions.",
    image: require("@/assets/images/front1.webp"),
  },
  {
    heading: "Every Trade, Fully \nProtected",
    text: "Our escrow system ensures that funds are only released when both parties fulfill their trade agreements.",
    image: require("@/assets/images/front3.webp"),
  },
];

export const paymentMethodFields: Record<
  string,
  { label: string; name: string; placeholder?: string }[]
> = {
  bank_transfer: [
    {
      name: "account_name",
      label: "Account Name",
      placeholder: "e.g. John Doe",
    },
    {
      name: "account_number",
      label: "Account Number",
      placeholder: "e.g. 1234567890",
    },
    { name: "bank_name", label: "Bank Name", placeholder: "e.g. Chase" },
  ],
  paypal: [
    {
      name: "paypal_email",
      label: "PayPal Email",
      placeholder: "e.g. user@example.com",
    },
  ],
  cashapp: [
    { name: "cashapp_tag", label: "Cash App Tag", placeholder: "$cashuser" },
  ],
  zelle: [
    {
      name: "zelle_email_or_phone",
      label: "Zelle Email or Phone",
      placeholder: "e.g. 123-456-7890 or email",
    },
  ],
  venmo: [
    {
      name: "venmo_username",
      label: "Venmo Username",
      placeholder: "@username",
    },
  ],

  amazon_gift_card: [
    {
      name: "gift_card_code",
      label: "Amazon Gift Card Code",
      placeholder: "e.g. XXXX-XXXX-XXXX",
    },
    {
      name: "receipt_image",
      label: "Receipt Image URL",
      placeholder: "https://...",
    },
  ],
  steam_gift_card: [
    {
      name: "gift_card_code",
      label: "Stream Gift Card Code",
      placeholder: "e.g. XXXX-XXXX-XXXX",
    },
    {
      name: "receipt_image",
      label: "Receipt Image URL",
      placeholder: "https://...",
    },
  ],
  apple_gift_card: [
    {
      name: "gift_card_code",
      label: "Apple Gift Card Code",
      placeholder: "e.g. XXXX-XXXX-XXXX",
    },
    {
      name: "receipt_image",
      label: "Receipt Image URL",
      placeholder: "https://...",
    },
  ],
  google_pay: [
    {
      name: "google_pay_number",
      label: "Google Pay Number",
      placeholder: "e.g. +1 234 567 8901",
    },
  ],
};

type PaymentMethod = {
  id: string;
  name: string;
  group: string;
};

export const groupedMethods: Record<string, PaymentMethod[]> = {
  "Banking & Transfers": [
    { id: "bank_transfer", name: "Bank Transfer", group: "bank" },
    { id: "zelle", name: "Zelle", group: "bank" },
    { id: "cashapp", name: "Cash App", group: "bank" },
    { id: "venmo", name: "Venmo", group: "bank" },
  ],
  "Online & Mobile Wallets": [
    { id: "paypal", name: "PayPal", group: "ewallet" },
    // { id: "applepay", name: "Apple Pay", group: "ewallet" },
    { id: "googlepay", name: "Google Pay", group: "ewallet" },
  ],
  "Gift Cards": [
    { id: "amazon_giftcard", name: "Amazon Gift Card", group: "giftcard" },
    { id: "steam_giftcard", name: "Steam Gift Card", group: "giftcard" },
    // { id: "itunes_giftcard", name: "iTunes Gift Card", group: "giftcard" },
    {
      id: "googleplay_giftcard",
      name: "Google Play Gift Card",
      group: "giftcard",
    },
    { id: "apple_gift_card", name: "Apple Gift Card", group: "giftcard" },
  ],
};
