import { ObjectId, Collection } from "mongodb";
import { from, of } from "rxjs";
import { map, flatMap } from "rxjs/operators";

export const imageUrl = (url: string) => {
  if (url.startsWith("/assets")) {
    return url.replace(/^\/assets\//g, "/static/");
  }
  return url;
};

export const convertPackage = (pkg: any) => ({
  _id: pkg._id,
  defaultTag: {
    code: "EN",
    name: pkg.name,
    description: pkg.description
  },
  tags: pkg.languages.map((language: any) => ({
    code: language.code,
    name: language.name,
    description: language.description
  })),
  reference: undefined,
  createdAt: pkg.created_at,
  updatedAt: pkg.updated_at,
  repeatConfig: "NONE",
  image: imageUrl(pkg.image),
  price: {
    currency: pkg.price.currency,
    amount: pkg.price.value
  },
  priority: pkg.priority,
  isActive: true,
  isCustom: false
});

interface IDonationEntity {
  _id: ObjectId;
  fullName: string;
  email: string;
  packageId: ObjectId;
  notes?: string;
  paymentConfirmed: boolean;
  date: Date;
  quantity: number;
  usingAmex: boolean;
}

export const convertDonation = (input: any): IDonationEntity => ({
  _id: input._id,
  date: input.date,
  email: input.email,
  fullName: `${input.name} ${input.surname}`,
  notes: undefined,
  packageId: input.packageId,
  paymentConfirmed: input.status,
  quantity: input.quantity || 1,
  usingAmex: false
});

export const setPackage = (packages: Collection) => (donation: any) => {
  const id = new ObjectId(donation.package._id || donation.package);
  return from(packages.findOne({ _id: id })).pipe(
    flatMap((pkg: any) => {
      if (!pkg) {

        const newPackage = {
          _id: id,
          defaultTag: {
            code: "EN",
            name: "Deleted Package",
            description: "This package was deleted in v1"
          },
          tags: [],
          reference: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          repeatConfig: "NONE",
          image: undefined,
          price: {
            currency: donation.price.currency,
            amount: donation.price.value
          },
          priority: 1,
          isActive: false,
          isCustom: false
        }

        const convertedPackage = donation.package._id && {
          ...convertPackage(donation.package),
          isActive: false
        }

        const updated = donation.package._id ? convertedPackage : newPackage;

        return from(
          packages.updateOne(
            { _id: id },
            {
              $set: updated
            },
            {
              upsert: true
            }
          )
        ).pipe(
          map(insertionResult => ({
            ...donation,
            package: undefined,
            packageId:
              (insertionResult.upsertedId && insertionResult.upsertedId._id) ||
              id
          }))
        );
      }

      return of({
        ...donation,
        package: undefined,
        packageId: id
      });
    })
  );
};
