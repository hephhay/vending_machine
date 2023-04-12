import { User } from "../../model";
import { hashPassowrd } from "../../utils";

export const seedUsers = async () => {
	// Clear the users collection
	await User.deleteMany({});

	const password = await hashPassowrd("Password123!");

	// Create some users
	await User.insertMany([
		{
			_id: "6113748e5e825d2d30f16b9f",
			username: "john",
			password: password,
			deposit: { "5": 10, "10": 5, "20": 1, "50": 2, "100": 1 },
			role: "buyer",
		},
		{
			_id: "6127c0f1a2215b0016935b2e",
			username: "jane",
			password: password,
			role: "seller",
		},
		{
			_id: "610b5d5c9a651f5b53d3f3c3",
			username: "bob",
			password: password,
			deposit: { "5": 0, "10": 0, "20": 0, "50": 0, "100": 0 },
			role: "buyer",
		},
		{
			_id: "613106e8eb8d8710d1d958eb",
			username: "hephhay",
			password: password,
			deposit: { "5": 11, "10": 5, "20": 13, "50": 1, "100": 2 },
			role: "buyer",
		},
		{
			_id: "6118c2b27d050d2e23f22ab4",
			username: "meeky",
			password: password,
			role: "seller",
		},
	]);
};
