import { app } from "../app.js";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const request = supertest(app);

// describe("Testing the testing environment", () => {
//   it("should check that true is true", () => {
//     expect(true).toBe(true);
//   });
// });

describe("Testing the app endpoints", () => {
  beforeAll((done) => {
    console.log("This gets run before all tests in this suite");

    mongoose.connect(process.env.MONGO_URL_TEST).then(() => {
      console.log("Connected to the test database");
      done();
    });
  });

  it("should check that the GET /test endpoint returns a success message", async () => {
    const response = await request.get("/test");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Test successful");
  });

  const validProduct = {
    name: "Test Product",
    price: 200,
  };

  it("should check that the POST /products endpoint creates a new product", async () => {
    const response = await request.post("/products").send(validProduct);

    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBeDefined();
    expect(response.body.price).toBeDefined();
  });

  it("should check that the GET /products endpoint returns a list of products", async () => {
    const response = await request.get("/products");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  /*   When retrieving the /products/:id endpoint:
expect requests to be 404 with a non-existing id
expect requests to return the correct product with a valid id */

  it("when retrieving the /products/:id endpoint with valid id", async () => {
    const product = await request.get("/products");
    const product_id = product.body[0]._id.toString();
    console.log(product_id);
    const response = await request.get(`/products/${product_id}`);
    expect(response.status).toBe(200);
  });

  it("when retrieving the /products/:id endpoint with a non-existing id", async () => {
    const response = await request.get("/products/600");
    expect(response.status).toBe(404);
  });

  /*   When deleting the /products/:id endpoint:
expect successful 204 response code
expect 404 with a non-existing id */
  it("when delete the /products/:id endpoint with valid id", async () => {
    const product = await request.get("/products");
    const product_id = product.body[0]._id.toString();
    console.log(product_id);
    const response = await request.delete(`/products/${product_id}`);
    expect(response.status).toBe(204);
  });

  it("when deleting the /products/:id endpoint with a non-existing id", async () => {
    const response = await request.get("/products/600");
    expect(response.status).toBe(404);
  });

  /*   When updating a /product/:id endpoint with new data:
expect requests to be accepted.
expect 404 with a non-existing id
Expect the response.body.name to be changed
Expect the typeof name in response.body to be “string” */

  afterAll((done) => {
    mongoose.connection
      .dropDatabase()
      .then(() => {
        return mongoose.connection.close();
      })
      .then(() => {
        done();
      })
      .catch(console.log);
  });

  // it("should test that the GET /products endpoint returns a list of products", async () => {})
});
