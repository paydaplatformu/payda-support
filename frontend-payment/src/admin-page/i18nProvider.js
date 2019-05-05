const dummyMessages = {
  "Bad Request": "Invalid Input",
  "GraphQL error: Authorization needed to access this function.":
    "Login Needed",
  "Network error: Response not successful: Received status code 400":
    "Invalid Input",
  "Subscription cancelled": "Subscription cancelled"
};

const i18nProvider = () => dummyMessages;

export default i18nProvider;
