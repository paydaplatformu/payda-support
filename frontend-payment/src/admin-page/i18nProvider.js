const dummyMessages = {
  "Bad Request": "Invalid Input",
  "GraphQL error: Authorization needed to access this function.": "Login Needed",
  "Network error: Response not successful: Received status code 400": "Invalid Input",
  "Error. Failed to cancel.": "Error. Failed to cancel.",
};

const i18nProvider = {
  translate: (key, options) => dummyMessages?.[key] ?? key,
  changeLocale: locale => Promise.resolve,
  getLocale: () => "en",
};

export default i18nProvider;
