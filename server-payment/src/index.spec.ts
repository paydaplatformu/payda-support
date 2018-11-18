import axios from "axios";
import { Server } from "http";
import "jest";
import { createServer } from "./server";

describe("API Test", () => {
  const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });

  let server: Server | undefined;
  beforeAll(async done => {
    if (server) {
      server.close(async () => {
        server = await createServer(() => {
          done();
        });
      });
    } else {
      server = await createServer(() => {
        done();
      });
    }
  });

  afterAll(done => {
    if (server) {
      server.close(() => {
        server = undefined;
        done();
      });
    }
  });

  test("Test test.", async () => {
    expect(true).toBeTruthy();
  });
});
