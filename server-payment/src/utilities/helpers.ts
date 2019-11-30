import { drop, sortBy } from "lodash";
import { Token } from "oauth2-server";
import { config } from "../config";
import { Authentication } from "../models/Authentication";
import { PaginationSettings } from "../models/PaginationSettings";
import { SortingSettings } from "../models/SortingSettings";

export function isDefined<T>(value: T | undefined | null): value is T {
  return <T>value !== undefined && <T>value !== null;
}

export const getUTF8Length = (input: string) => {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  const match = encodeURIComponent(input).match(/%[89ABab]/g);
  return input.length + (match ? match.length : 0);
};

export const isNonProduction = () => {
  return ["development", "test", "staging"].includes(config.get("environment"));
};

export const isProduction = () => {
  return config.get("environment") === "production";
};

export const splitName = (fullName: string) => {
  const splitted = fullName.split(" ");
  const firstName = splitted.slice(0, -1).join(" ");
  const lastName = splitted.slice(-1).join(" ");
  return {
    firstName,
    lastName
  };
};

export const getPaginationFromNullable = (page?: number | null, perPage?: number | null): PaginationSettings | null => {
  return isDefined(page) && isDefined(perPage) ? { page, perPage } : null;
};

export const createTokenGetter = (authenticationModel: Authentication) => async (
  header: string | undefined
): Promise<Token | null> => {
  if (header) {
    try {
      const token = await authenticationModel.getAccessToken(header.replace("Bearer ", ""));
      return token || null;
    } catch {
      return null;
    }
  }
  return null;
};
