import { AuthenticationError, UserInputError } from "apollo-server-core";

export class AuthenticationRequired extends AuthenticationError {
  constructor() {
    super("Authorization needed to access this function.");
    this.statusCode = 403;
  }
}

export enum FieldErrorCode {
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_NAME = "INVALID_NAME",
  FULL_NAME_LENGTH = "FULL_NAME_LENGTH",
  INVALID_QUANTITY = "INVALID_QUANTITY",
  PACKAGE_DOES_NOT_EXIST = "PACKAGE_DOES_NOT_EXIST",
  INVALID_AMOUNT = "INVALID_AMOUNT"
}

export interface InvalidField {
  name: string;
  code: FieldErrorCode;
}

export class InvalidInput extends UserInputError {
  constructor(invalidFields: InvalidField[]) {
    super("Invalid input.", {
      invalidFields
    });
    this.statusCode = 400;
  }
}

export class AuthorizationError extends AuthenticationError {
  constructor(message: string = "Not authorized.") {
    super(message);
    this.statusCode = 401;
  }
}

export class ValidationError extends InvalidInput {
  constructor(invalidFields: InvalidField[]) {
    super(invalidFields);
  }
}
