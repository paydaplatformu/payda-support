
export class AuthorizationRequired extends Error {
  constructor() {
    super("Authorization needed to access this function.");
  }
}
