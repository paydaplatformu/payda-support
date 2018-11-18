import {
  AuthorizationCodeModel,
  ClientCredentialsModel,
  ExtensionModel,
  PasswordModel,
  RefreshTokenModel
} from "oauth2-server";

export interface IAuthentication
  extends AuthorizationCodeModel,
    ClientCredentialsModel,
    RefreshTokenModel,
    PasswordModel,
    ExtensionModel {}
