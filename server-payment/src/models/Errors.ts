import { AuthenticationError, UserInputError } from "apollo-server-core";

export class AuthorizationRequired extends AuthenticationError {
  constructor() {
    super("Authorization needed to access this function.");
  }
}


export enum FieldErrorCode {
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_NAME = "INVALID_NAME",
  FULL_NAME_LENGTH = "FULL_NAME_LENGTH",
  PACKAGE_DOES_NOT_EXIST = "PACKAGE_DOES_NOT_EXIST"
}

export interface InvalidField {
  name: string,
  code: FieldErrorCode
}

export class InvalidInput extends UserInputError {
  constructor(invalidFields: InvalidField[]) {
    super("Invalid input.", {
      invalidFields
    })
  }
}

export class ValidationError extends Error {
  public invalidFields: InvalidField[];
  constructor(invalidFields: InvalidField[]) {
    super("Invalid data.")
    this.invalidFields = invalidFields;
  }
}
