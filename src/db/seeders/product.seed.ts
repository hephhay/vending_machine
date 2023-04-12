import { Product } from "../../model";

export const seedProducts = async () => {
    // clear any existing data
    await Product.deleteMany({});

    // create some test products
    await Product.insertMany([
        {
            _id: "6124d4ecb6a0c828df8d18e7",
            productName: "Product 1",
            amountAvailable: 10,
            cost: 20,
            sellerID: "6118c2b27d050d2e23f22ab4"
        },
        {
            _id: "610d39b677e6b1a6d4f6b4a6",
            productName: "Product 2",
            amountAvailable: 5,
            cost: 15,
            sellerID: "6118c2b27d050d2e23f22ab4"
        },
        {
            _id: "6128f82e3d3b320022f9641a",
            productName: "Product 3",
            amountAvailable: 20,
            cost: 30,
            sellerID: "6118c2b27d050d2e23f22ab4"
        },
        {
            _id: "611dbd17e269e24be9c75d8d",
            productName: "Product 4",
            amountAvailable: 2,
            cost: 50,
            sellerID: "6118c2b27d050d2e23f22ab4"
        },

        {
            _id: "612ae168178f670024b93c2f",
            productName: "Product 5",
            amountAvailable: 13,
            cost: 20,
            sellerID: "6127c0f1a2215b0016935b2e"
        }
    ]);
}
