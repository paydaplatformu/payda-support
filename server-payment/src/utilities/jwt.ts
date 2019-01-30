import jwt from "jsonwebtoken";
import { config } from "../config";

export const sign = (payload: string | object | Buffer, expiresIn: number): Promise<string> =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.get("jwt.secret"),
      {
        audience: config.get("jwt.audience"),
        expiresIn,
        issuer: config.get("jwt.issuer"),
        subject: config.get("jwt.subject")
      },
      (err, encoded) => {
        if (err) return reject(err);
        return resolve(encoded);
      }
    );
  });

export const verify = <T>(token: string): Promise<T> =>
  new Promise((resolve, reject) => {
    jwt.verify(
      token,
      config.get("jwt.secret"),
      {
        audience: config.get("jwt.audience"),
        issuer: config.get("jwt.issuer"),
        subject: config.get("jwt.subject")
      },
      (err, result) => {
        if (err) return reject(err);
        return resolve((result as any) as T);
      }
    );
  });
