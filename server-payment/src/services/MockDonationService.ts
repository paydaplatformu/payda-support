import { inject, injectable } from "inversify";
import { isAlpha, isEmail, isLength } from 'validator';
import { IDonation, IDonationCreator } from "../models/Donation";
import { IDonationService } from "../models/DonationService";
import { FieldErrorCode, ValidationError } from "../models/Errors";
import { IPackageService } from "../models/PackageService";
import { Validator } from "../models/Validator";
import { TYPES } from "../types";
import { BaseEntityService } from "../models/BaseEntityService";

@injectable()
export class MockDonationService extends BaseEntityService<IDonationCreator> implements IDonationService {
  private donations: IDonation[];

  @inject(TYPES.IPackageService) private packageService: IPackageService = null as any;

  constructor() {
    super()
    this.donations = [
      {
        id: "d1",
        date: new Date(),
        email: "donator1@gmail.com",
        fullName: "First donator",
        packageId: "p1",
        paymentConfirmed: true
      },
      {
        id: "d2",
        date: new Date(),
        email: "supporter@microsoft.com",
        fullName: "Support Person",
        packageId: "p2",
        paymentConfirmed: true
      },
      {
        id: "d3",
        date: new Date(),
        email: "non_confirmed@supporter.com",
        fullName: "Non Confirmed",
        packageId: "p1",
        paymentConfirmed: false
      }
    ];
  }

  public creatorValidator: Validator<IDonationCreator> = {
    email: async value => {
      if (!isEmail(value)) return [FieldErrorCode.INVALID_EMAIL]
      return null;
    },
    fullName: async value => {
      if (!isAlpha(value.replace(/[ .]/g, ""))) return [FieldErrorCode.INVALID_NAME]
      else if (!isLength(value, { min: 1, max: 100 })) return [FieldErrorCode.INVALID_EMAIL]
      return null;
    },
    packageId: async value => {
      const donationPackage = await this.packageService.getById(value)
      if (!donationPackage) return [FieldErrorCode.PACKAGE_DOES_NOT_EXIST]
      return null;
    }
  }

  public create = async (donationCreator: IDonationCreator) => {
    const errors = await this.validate(donationCreator)
    if (errors) throw new ValidationError(errors)

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
