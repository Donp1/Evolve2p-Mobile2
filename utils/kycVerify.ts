import { Linking } from "react-native";

// You should call this from your backend in production for security.
export default async (inquiryId: string) => {
  try {
    const res = await fetch(
      `https://api.withpersona.com/api/v1/inquiries/${inquiryId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer persona_sandbox_a1c393b4-ced8-4ca9-9ee7-8279f1b6c5cf", // Replace with your real key (or call from backend)
        },
        body: JSON.stringify({
          data: {
            type: "inquiry",
            attributes: {
              inquiryTemplateId: "itmpl_wJ9idPLbC6fEFa9Sc6hnPKn2RAsd", // Replace with your actual template ID
              environment: "sandbox", // or 'production'
            },
          },
        }),
      }
    );

    const json = await res.json();
    console.log(json);
    const inquiryUrl = json.data?.attributes?.inquiryUrl;

    if (!inquiryUrl) {
      throw new Error("No inquiry URL returned");
    }

    // Open the inquiry in the default browser
    // Linking.openURL("https://inquiry.withpersona.com/verify?code=us2-vd57ykc");
  } catch (error) {
    console.error("Error starting Persona KYC:", error);
  }
};
