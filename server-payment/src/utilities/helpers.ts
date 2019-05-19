import { drop, sortBy } from "lodash";
import { Token } from "oauth2-server";
import { config } from "../config";
import { Authentication } from "../models/Authentication";
import { PaginationSettings } from "../models/PaginationSettings";
import { SortingSettings } from "../models/SortingSettings";

export const isDefined = (val: any) => val !== undefined && val !== null;

export const sortAndPaginate = <T>(array: T[], pagination: PaginationSettings, sorting: SortingSettings): T[] => {
  const sorted = sortBy(array, sorting.sortField);
  const sortedWithOrder = sorting.sortOrder === "DESC" ? sorted.reverse() : sorted;
  const page = pagination.page || 1;
  const pageSize = pagination.perPage || 100;
  const offset = page * pageSize;
  return drop(sortedWithOrder, offset).slice(0, pageSize);
};

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
