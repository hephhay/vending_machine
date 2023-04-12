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

describe("Test Deposit Endpoint", () => {

    const Endpoint = "/deposit";

    let cookie: string[], amount: string;

    before(async () => {

        await seedUsers();
        await seedProducts();

        cookie = await login("hephhay", "Password123!");
        amount = "50";
    });

    it("Deposit Failure if Not Authenticated", async () => {

        const res = await chai.request(app)
            .post(Endpoint);

        expect(res.status).equal(HTTPStatusCodes.UNAUTHORIZED);
    });

    it("Deposit Failure if Seller", async () => {

        const res = await chai.request(app)
            .post(Endpoint)
            .set("Cookie", await login("meeky", "Password123!"))
            .send({
                "amount": amount
            });

        expect(res.status).equal(HTTPStatusCodes.FORBIDDEN);
    });

    it("Deposit Failure Wrong Amount", async () => {

        const res = await chai.request(app)
            .post(Endpoint)
            .set("Cookie", cookie)
            .send({
                "amount": 150
            });

        expect(getObject(res).message).equal("Invalid Input");
        expect(res.status).equal(HTTPStatusCodes.BAD_REQUEST);
    });

    it("Deposit Successfull", async () => {

        await seedUsers();

        const res = await chai.request(app)
            .post(Endpoint)
            .set("Cookie", cookie)
            .send({
                "amount": amount
            });

        const data = getObject(res);

        expect(data.message).equal("amount deposited successfully");

        expect(accessPath("data.deposit.50", data)).equal(2)
        expect(res.status).equal(HTTPStatusCodes.OK);
    });
});