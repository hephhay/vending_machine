import chai from "chai";

import app from "../index";

interface RecursiveRecord {
    [key: string]: string | undefined | boolean | Number | RecursiveRecord;
}

export async function login(username: string, password: string) {

    const res = await chai.request(app)
        .post('/login')
        .send({
            "username": username,
            "password": password
        });

    return res.header['set-cookie'] as string[]
}

export const getObject = (res: ChaiHttp.Response): RecursiveRecord => 
    JSON.parse(res.text);
