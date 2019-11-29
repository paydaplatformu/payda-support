import { inject, injectable } from "inversify";
import { AuthorizationCode, Client, Falsey, RefreshToken, Token, User } from "oauth2-server";
import { config } from "../config";
import { Authentication } from "../models/Authentication";
import { UserModel } from "../models/User";
import { UserService } from "./user/UserService";
import { TYPES } from "../types";
import { sign, verify } from "../utilities/jwt";

interface ITokenBody {
  user: UserModel;
  client: Client;
  scope: string | string[];
}

@injectable()
export class JwtAuthentication implements Authentication {
  private clients = (config.get("clients") as any) as Client[];

  @inject(TYPES.UserService) private userService: UserService = null as any;

  /**
   * Invoked to generate a new refresh token.
   *
   */
  public async generateRefreshToken(client: Client, user: UserModel, scope: string | string[]): Promise<string> {
    const body: ITokenBody = {
      client,
      scope,
      user
    };
    return sign(body, client.refreshTokenLifetime || config.get("jwt.refreshTokenLifetime"));
  }

  /**
   * Invoked to retrieve an existing refresh token previously saved through Model#saveToken().
   *
   */
  public async getRefreshToken(refreshToken: string): Promise<RefreshToken | Falsey> {
    const body = await verify<ITokenBody>(refreshToken);
    return {
      refreshToken,
      client: body.client,
      scope: body.scope,
      user: body.user
    };
  }

  /**
   * Invoked to revoke a refresh token.
   *
   */
  public async revokeToken(token: RefreshToken | Token): Promise<boolean> {
    return false;
  }

  /**
   * Invoked to retrieve a user using a username/password combination.
   *
   */
  public async getUser(username: string, password: string): Promise<User | Falsey> {
    return this.userService.getByEmailAndPassword(username, password);
  }

  /**
   * Invoked to check if the requested scope is valid for a particular client/user combination.
   *
   */
  public async validateScope(
    user: User,
    client: Client,
    scope: string | string[]
  ): Promise<string | string[] | Falsey> {
    return scope;
  }

  /**
   * Invoked to generate a new access token.
   *
   */
  public async generateAccessToken(client: Client, user: UserModel, scope: string | string[]): Promise<string> {
    const body: ITokenBody = {
      client,
      scope,
      user
    };
    return sign(body, client.accessTokenLifetime || config.get("jwt.accessTokenLifetime"));
  }

  /**
   * Invoked to retrieve a client using a client id or a client id/client secret combination,
   * depending on the grant type.
   */
  public async getClient(clientId: string, clientSecret: string): Promise<Client | Falsey> {
    return this.clients.find(c => c.id === clientId && c.secret === clientSecret);
  }

  /**
   * Invoked to save an access token and optionally a refresh token, depending on the grant type.
   *
   */
  public async saveToken(token: Token, client: Client, user: User): Promise<Token | Falsey> {
    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      client,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
      user
    };
  }

  /**
   * Invoked to retrieve an existing access token previously saved through Model#saveToken().
   *
   */
  public async getAccessToken(accessToken: string): Promise<Token | Falsey> {
    const body = await verify<ITokenBody>(accessToken);
    return {
      accessToken,
      client: body.client,
      scope: body.scope,
      user: body.user
    };
  }

  /**
   * Invoked during request authentication to check if the provided access token was authorized the requested scopes.
   *
   */
  public async verifyScope(token: Token, scope: string | string[]): Promise<boolean> {
    return scope === "admin" || (Array.isArray(scope) && scope.includes("scope") && scope.length === 0);
  }

  /**
   * Invoked to generate a new authorization code.
   *
   */
  public async generateAuthorizationCode(client: Client, user: User, scope: string | string[]): Promise<string> {
    throw new Error("Grant not allowed.");
  }

  /**
   * Invoked to retrieve an existing authorization code previously saved through Model#saveAuthorizationCode().
   *
   */
  public async getAuthorizationCode(authorizationCode: string): Promise<AuthorizationCode | Falsey> {
    throw new Error("Grant not allowed.");
  }

  /**
   * Invoked to save an authorization code.
   *
   */
  public async saveAuthorizationCode(
    code: AuthorizationCode,
    client: Client,
    user: User
  ): Promise<AuthorizationCode | Falsey> {
    throw new Error("Grant not allowed.");
  }

  /**
   * Invoked to revoke an authorization code.
   *
   */
  public async revokeAuthorizationCode(code: AuthorizationCode): Promise<boolean> {
    throw new Error("Grant not allowed.");
  }

  /**
   * Invoked to retrieve the user associated with the specified client.
   *
   */
  public async getUserFromClient(client: Client): Promise<User | Falsey> {
    throw new Error("Grant not allowed.");
  }
}
