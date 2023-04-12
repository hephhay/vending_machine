import { connectDB, disconnectDB } from "..";
import { seedProducts } from "./product.seed";
import { seedUsers } from "./user.seed";

(async (db_url: string) => {
    await connectDB(db_url);

    await seedUsers();
    await seedProducts();

    await disconnectDB();

})(process.env.DB_URL!);
