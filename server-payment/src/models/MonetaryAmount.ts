import { Currency } from "./Currency";

export interface MonetaryAmount {
  currency: Currency;
  amount: number;
}
