import { LanguageCode } from "./LanguageCode";

export interface PackageTag {
  code: LanguageCode;
  name: string;
  description?: string;
}
