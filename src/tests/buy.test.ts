import { describe } from "node:test";

import chai, { expect } from "chai";
import { config } from "dotenv";
import chaiHttp from "chai-http";

import app from "../index";
import { accessPath, HTTPStatusCodes } from "../utils";
import { getObject, login } from "./util";
import { seedUsers } from "../db/seeders/user.seed";
import { seedProducts } from "../db/seeders/product.seed";
import { before } from "mocha";

config();

chai.use(chaiHttp);

describe("Test buy Endpoint", () => {

    const Endpoint = "/buy";

    let cookie: string[], quantity: number;

    let productID = "6124d4ecb6a0c828df8d18e7";

    before(async () => {

        await seedUsers();
        await seedProducts();

        cookie = await login("hephhay", "Password123!");
        quantity = 10;
    });

    it("Buy Failure if Not Authenticated", async () => {

        const res = await chai.request(app)
            .post(Endpoint);

        expect(res.status).equal(HTTPStatusCodes.UNAUTHORIZED);
    });

    it("Buy Failure if Seller", async () => {

        const res = await chai.request(app)
            .post(Endpoint)
            .set("Cookie", await login("meeky", "Password123!"))
            .send({
                "productID": productID,
                "quantity": quantity
            });

        expect(res.status).equal(HTTPStatusCodes.FORBIDDEN);
    });

    it("Failure if Buy Quantity is more", async () => {

        const res = await chai.request(app)
            .post(Endpoint)
            .set("Cookie", cookie)
            .send({
                "productID": productID,
                "quantity": 11
            });

        expect(getObject(res).message).equal("Not Enough Product");
        expect(res.status).equal(HTTPStatusCodes.BAD_REQUEST);
    });

    it("Buy Failure if Insufficient Balance", async () => {

        const res = await chai.request(app)
            .post(Endpoint)
            .set("Cookie", await login("bob", "Password123!"))
            .send({
                "productID": productID,
                "quantity": quantity
            });

        expect(getObject(res).message).equal("Insufficient Balance");
        expect(res.status).equal(HTTPStatusCodes.BAD_REQUEST);
    });

    it("Successfull Buy", async () => {

        const res = await chai.request(app)
            .post(Endpoint)
            .set("Cookie", cookie)
            .send({
                "productID": productID,
                "quantity": quantity
            });

        const data = getObject(res);

        expect(data.message).equal("product bought");
        expect(accessPath("data.change", data)).to.deep.equal([
            ['5', 11],
            ['10', 5],
            ['20', 13],
            ['50', 1],
            ['100', 0]
        ]);
        expect(res.status).equal(HTTPStatusCodes.OK);
    });
});