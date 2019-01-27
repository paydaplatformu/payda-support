
export interface IDonationCreator {
  fullName: string;
  email: string;
  packageId: string;
}

export interface IDonationFilters {
  paymentConfirmed: boolean;
}

export interface IDonation {
  id: string;
  fullName: string;
  email: string;
  packageId: string;
  paymentConfirmed: boolean;
  date: Date;
}
