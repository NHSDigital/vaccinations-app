import request from "supertest";
import app from "../src/app";
import { describe, expect, it } from "@jest/globals";

describe("Index Controller", () => {
  it("GET / should return our home page", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.type).toEqual("text/html");
  });
});
