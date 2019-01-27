import React from "react";

import Title from "./Title";
import DonationList from "./donation/DonationList";
import UserForm from "./UserForm";
import LegalLinks from "./LegalLinks";

const SupportPage = () => (
  <div>
    <Title />
    <DonationList />
    <UserForm />
    <LegalLinks />
  </div>
);

export default SupportPage;
