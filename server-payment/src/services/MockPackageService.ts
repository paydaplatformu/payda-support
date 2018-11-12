import { injectable } from "inversify";
import { Currency } from "../models/Currency";
import { LanguageCode } from "../models/LanguageCode";
import { IPackage, IPackageCreator, IPackageModifier } from "../models/Package";
import { IPackageFilters } from "../models/PackageFilters";
import { IPackageService } from "../models/PackageService";
import { RepeatConfig } from "../models/RepeatConfig";

@injectable()
export class MockPackageService implements IPackageService {
  private packages: IPackage[];
  constructor() {
    this.packages = [
      {
        id: "p1",
        defaultTag: { code: LanguageCode.EN, name: "aen" },
        price: {
          amount: 3,
          currency: Currency.TRY
        },
        priority: 2,
        repeatConfig: RepeatConfig.NONE,
        tags: [{ code: LanguageCode.TR, name: "atr" }],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      },
      {
        id: "p2",
        defaultTag: { code: LanguageCode.EN, name: "cxxcv", description: "dejio" },
        price: {
          amount: 23,
          currency: Currency.TRY
        },
        priority: 32,
        repeatConfig: RepeatConfig.WEEKLY,
        tags: [{ code: LanguageCode.TR, name: "rghy" }],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      },
      {
        id: "p3",
        defaultTag: { code: LanguageCode.EN, name: "faerf", description: "hte" },
        price: {
          amount: 134,
          currency: Currency.TRY
        },
        priority: 32,
        repeatConfig: RepeatConfig.WEEKLY,
        tags: [{ code: LanguageCode.TR, name: "vsdfv" }],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false
      }
    ];
  }

  public getAll = async ({ onlyActive }: IPackageFilters) => {
    if (onlyActive) {
      return this.packages.filter(p => p.isActive);
    }
    return this.packages;
  };

  public getById = async (id: string) => this.packages.find(p => p.id === id) || null;

  public create = async (packageCreator: IPackageCreator) => {
    const newPackage = {
      id: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5),
      defaultTag: packageCreator.defaultTag,
      price: packageCreator.price,
      priority: packageCreator.priority,
      repeatConfig: packageCreator.repeatConfig,
      tags: packageCreator.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    this.packages.push(newPackage);
    return newPackage;
  };

  public edit = async (packageModifier: IPackageModifier) => {
    const current = await this.getById(packageModifier.id);
    if (!current) return null;
    const next: IPackage = {
      ...current,
      ...packageModifier
    };
    this.packages = this.packages.filter(p => p.id !== packageModifier.id).concat([next]);
    return next;
  };

  private setIsActive = (value: boolean) => async (id: string) => {
    const current = await this.getById(id);
    if (!current) return null;
    const next: IPackage = {
      ...current,
      isActive: value
    };
    this.packages = this.packages.filter(p => p.id !== id).concat([next]);
    return id;
  };

  public deactivate = this.setIsActive(false); // tslint:disable-line

  public activate = this.setIsActive(true); // tslint:disable-line

}
