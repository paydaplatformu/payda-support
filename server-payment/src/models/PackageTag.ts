import { LanguageCode } from "./LanguageCode";

export interface IPackageTag {
  code: LanguageCode;
  name: string;
  description?: string;
}
