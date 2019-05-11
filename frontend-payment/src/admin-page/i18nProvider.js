const dummyMessages = {
  "Bad Request": "Invalid Input",
  "GraphQL error: Authorization needed to access this function.":
    "Login Needed",
  "Network error: Response not successful: Received status code 400":
    "Invalid Input",
  "Subscription cancelled": "Subscription cancelled",
  "Subscription charged": "Subscription charged",
  "Error. Failed to charge. Click on subscription for more details":
    "Error. Failed to charge. Click on subscription for more details",
  "Error. Failed to cancel.": "Error. Failed to cancel."
};

const i18nProvider = () => dummyMessages;

export default i18nProvider;
