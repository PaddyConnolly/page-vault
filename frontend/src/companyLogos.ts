export const mapCompanyLogo = (name: string) => {
  let logo = "";
  switch (name) {
    case "Datadog":
      logo = "datadoghq";
      break;
    case "Checkout.com":
      logo = "checkout";
      break;
    case "Starling":
      logo = "starlingbank";
      break;
    case "Modulr":
      logo = "modulrfinance";
      break;
    case "Millennium":
      logo = "mlp";
      break;
    case "HRT":
      logo = "hudsonrivertrading";
      break;
    case "Marshall Wace":
      logo = "mwam";
      break;
    case "Bank of America":
      logo = "bofa";
      break;
    default:
      logo = name.replace(/\s/g, "");
  }
  return logo.toLowerCase();
};
