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
  beforeAll(done => {
    if (server) {
      server.close(() => {
        server = createServer(() => {
          done();
        });
      });
    } else {
      server = createServer(() => {
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
