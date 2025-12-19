import Contentstack from "contentstack";

export const initializeContentstackSdk = () => {
  const {
    VITE_CONTENTSTACK_API_KEY,
    VITE_CONTENTSTACK_DELIVERY_TOKEN,
    VITE_CONTENTSTACK_ENVIRONMENT,
    VITE_CONTENTSTACK_REGION,
  } = import.meta.env;

  const region: Contentstack.Region | undefined = (function (
    regionValue: string
  ) {
    switch (regionValue) {
      case "US":
        return Contentstack.Region.US;
      case "EU":
        return Contentstack.Region.EU;
      case "AZURE_NA":
        return Contentstack.Region.AZURE_NA;
      case "AZURE_EU":
        return Contentstack.Region.AZURE_EU;
      case "GCP_NA":
        return Contentstack.Region.GCP_NA;
      default:
        return undefined;
    }
  })(VITE_CONTENTSTACK_REGION as string);

  if (!region) {
    throw new Error(
      "Invalid region provided in VITE_CONTENTSTACK_REGION. Valid values are: " +
        Object.keys(Contentstack.Region).join(", ")
    );
  }

  const Stack = Contentstack.Stack({
    api_key: VITE_CONTENTSTACK_API_KEY as string,
    delivery_token: VITE_CONTENTSTACK_DELIVERY_TOKEN as string,
    environment: VITE_CONTENTSTACK_ENVIRONMENT as string,
    region: region,
  });
  return Stack;
};
