import { describe } from "node:test";

import chai, { expect } from "chai";
import { config } from "dotenv";
import chaiHttp from "chai-http";

import app from "../index";
import { accessPath, HTTPStatusCodes } from "../utils";
import { getObject, login } from "./util";
import { seedUsers } from "../db/seeders/user.seed";
import { seedProducts } from "../db/seeders/product.seed";
import { before, beforeEach } from "mocha";

config();

chai.use(chaiHttp);

describe("Test Product Endpoint", () => {

    const Endpoint = "/product/";

    let cookie: string[]

    let productID = "6124d4ecb6a0c828df8d18e7";

    const product = {
        "productName": "pepsi",
        "cost": 30,
        "amountAvailable": 8
    };

    before(async () => {

        await seedUsers();

        cookie = await login("meeky", "Password123!");
    });

    beforeEach(async () => {

        await seedProducts();
    })

    it("Anyone can Get All Products", async () => {

        const res = await chai.request(app)
            .get(Endpoint);

        expect(res.status).equal(HTTPStatusCodes.OK);
        const data = getObject(res);
        expect(data.message).equal("products found");
    });

    it("Anyone can Get One Product", async () => {

        const res = await chai.request(app)
            .get(Endpoint + productID);

        expect(res.status).equal(HTTPStatusCodes.OK);
        const data = getObject(res);
        expect(data.message).equal("product found");
    });

    it("Failure When Buyer Create Product", async () => {

        const res = await chai.request(app)
        .post(Endpoint)
        .set("Cookie", await login("hephhay", "Password123!"))
        .send(product);

    expect(res.status).equal(HTTPStatusCodes.FORBIDDEN);
    });

    it("Success When Seller Create Product", async () => {

        const res = await chai.request(app)
        .post(Endpoint)
        .set("Cookie", cookie)
        .send(product);

    expect(res.status).equal(HTTPStatusCodes.CREATED);
    expect(getObject(res).message).equal("Product created succesfully");
    });

    it("Success When Owner Update Product", async () => {

        const res = await chai.request(app)
        .put(Endpoint + productID)
        .set("Cookie", cookie)
        .send({
            productName: 'pepsi'
        });

    expect(res.status).equal(HTTPStatusCodes.OK);

    const data = getObject(res);
    expect(data.message).equal("product updated successfully");
    expect(accessPath("data.productName", data)).equal('pepsi');
    });

    it("Failure When Non Owner Update Product", async () => {

        const res = await chai.request(app)
        .put(Endpoint + productID)
        .set("Cookie", await login("jane", "Password123!"));

    expect(res.status).equal(HTTPStatusCodes.FORBIDDEN);
    });

    it("Success When Owner Delete Product", async () => {

        const res = await chai.request(app)
        .delete(Endpoint + productID)
        .set("Cookie", cookie)

    expect(res.status).equal(HTTPStatusCodes.OK);
    });
});
