import { injectable } from "inversify";
import { IDonation, IDonationCreator } from "../models/Donation";
import { IDonationService } from "../models/DonationService";

@injectable()
export class MockDonationService implements IDonationService {
  private donations: IDonation[];
  constructor() {
    this.donations = [
      {
        id: "d1",
        date: new Date(),
        email: "a@a.com",
        fullName: "asdf asf",
        packageId: "p1",
        paymentConfirmed: true
      },
      {
        id: "d2",
        date: new Date(),
        email: "b@b.com",
        fullName: "yujtyujt asf",
        packageId: "p2",
        paymentConfirmed: true
      },
      {
        id: "d3",
        date: new Date(),
        email: "c@c.com",
        fullName: "carfer asf",
        packageId: "p1",
        paymentConfirmed: false
      }
    ];
  }

  public create = async (donationCreator: IDonationCreator) => {
    const newDonation = {
      id: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5),
      email: donationCreator.email,
      fullName: donationCreator.fullName,
      packageId: donationCreator.packageId,
      date: new Date(),
      paymentConfirmed: false
    };
    this.donations.push(newDonation);
    return newDonation;
  };

  public getAll = async () => this.donations;

  public getByPackageId = async (packageId: string) => this.donations.filter(d => d.packageId === packageId);

  public getById = async (id: string) => this.donations.find(d => d.id === id) || null;

  public cleanPendingDonations = async () => {
    const currentLength = this.donations.length;
    this.donations = this.donations.filter(d => d.paymentConfirmed === true);
    return currentLength - this.donations.length;
  };
}
