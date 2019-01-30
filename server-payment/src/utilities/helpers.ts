import { SortingSettings } from "../models/SortingSettings";
import { PaginationSettings } from "../models/PaginationSettings";
import { sortBy, drop } from "lodash";

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
}
