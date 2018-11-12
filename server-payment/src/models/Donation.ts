
export interface IDonationCreator {
  fullName: string;
  email: string;
  packageId: string;
}

export interface IDonation {
  id: string;
  fullName: string;
  email: string;
  packageId: string;
  paymentConfirmed: boolean;
  date: Date;
}
