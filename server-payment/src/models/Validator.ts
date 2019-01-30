import { FieldErrorCode } from "./Errors";

export type Validator<T> = { [t in keyof T]?: (value: T[t]) => Promise<FieldErrorCode[] | null> };
