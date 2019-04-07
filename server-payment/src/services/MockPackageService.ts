import { injectable } from "inversify";
import { Currency } from "../models/Currency";
import { LanguageCode } from "../models/LanguageCode";
import { IPackage, IPackageCreator, IPackageFilters, IPackageModifier } from "../models/Package";
import { IPackageService } from "../models/PackageService";
import { PaginationSettings } from "../models/PaginationSettings";
import { RepeatConfig } from "../models/RepeatConfig";
import { SortingSettings } from "../models/SortingSettings";
import { sortAndPaginate } from "../utilities/helpers";
import { IMonetaryAmount } from "../models/MonetaryAmount";

@injectable()
export class MockPackageService implements IPackageService {
  private packages: IPackage[];
  constructor() {
    this.packages = [
      {
        id: "p1",
        defaultTag: {
          code: LanguageCode.EN,
          name: "Platinum Supporter",
          description:
            "The donation will be used by Payda to grow existing projects, \
            kickstart new ones and maintain operational efficiency as the \
            organization becomes larger through investments in infrastructural systems."
        },
        price: {
          amount: 10000,
          currency: Currency.TRY
        },
        isCustomizable: false,
        isCustom: false,
        priority: 2,
        repeatConfig: RepeatConfig.NONE,
        tags: [
          {
            code: LanguageCode.TR,
            name: "Platinyum Destekçi",
            description:
              "Bu desteğiniz, Payda'nın mevcut projelerini geliştirebilmesi, \
              yeni projeleri başlatabilmesi ve kurumsal olarak büyürken de \
              verimli çalışmasını mümkün kılacak yatırımlar için değerlendirilecektir."
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      },
      {
        id: "p2",
        defaultTag: { code: LanguageCode.EN, name: "Laptop" },
        price: {
          amount: 23,
          currency: Currency.TRY
        },
        isCustomizable: false,
        isCustom: false,
        priority: 32,
        repeatConfig: RepeatConfig.WEEKLY,
        tags: [{ code: LanguageCode.TR, name: "Dizüstü Bilgisayar" }],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      },
      {
        id: "p3",
        defaultTag: {
          code: LanguageCode.EN,
          name: "Connecting Schools Project",
          description:
            "Connecting Schools Project This project came up when some \
            students in Payda With Students Project asked “can you teach \
            us English?” In this project, which we created after thinking \
            how we could meet this demand permanently and ensuring the \
            cohesion of the different segments parallel to Payda’s main \
            objective, students from different regions of Turkey are matched \
            and they are making video conference via Internet in the \
            after-school hours to practice their English on current issues. \
            After the first two years that advanced on the basis of English \
            practice between Robert College and Mardin Science High School \
            students, Üsküdar American High School and Aziz Sancar Anatolian \
            High School we will include in other schools and other “common denominators”."
        },
        price: {
          amount: 150,
          currency: Currency.TRY
        },
        isCustomizable: true,
        isCustom: false,
        priority: 32,
        repeatConfig: RepeatConfig.WEEKLY,
        tags: [
          {
            code: LanguageCode.TR,
            name: "Okullar Konuşuyor Projesi",
            description:
              "Okullar Konuşuyor Projesi Payda Öğrencilerle Birlikte Projesindeki \
              bazı öğrencilerin, “siz bize İngilizce öğretir misiniz?” demesiyle \
              ortaya çıktı Okullar Konuşuyor Projesi. Payda olarak bu talebi nasıl \
              kalıcı ve Payda’nın ana amacı olan farklı kesimlerin kaynaşmasını \
              sağlayacak şekilde karşılayabileceğimizi düşünerek oluşturduğumuz bu \
              projede Türkiye’nin farklı bölgelerindeki öğrenciler eşleştiriliyor \
              ve okul sonrası saatlerde, güncel konular üzerinde İngilizce pratiği \
              yapabilmek için internet üzerinden video konferans yapıyorlar."
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false
      }
    ];
  }

  public getAll = async ({ onlyActive }: IPackageFilters, pagination: PaginationSettings, sorting: SortingSettings) => {
    let results = this.packages;
    if (onlyActive) {
      results = this.packages.filter(p => p.isActive);
    }
    return sortAndPaginate(results, pagination, sorting);
  };

  public count = async (filters: IPackageFilters) => {
    const results = await this.getAll(
      filters,
      { page: 1, perPage: Number.MAX_SAFE_INTEGER },
      { sortOrder: "ASC", sortField: "id" }
    );
    return results.length;
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
      isCustomizable: packageCreator.isCustomizable,
      isCustom: packageCreator.isCustom,
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

  public isCustomPrice = (originalPrice: IMonetaryAmount, price: IMonetaryAmount) =>
    originalPrice.amount === price.amount && originalPrice.currency === price.currency;
}
