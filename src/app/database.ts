import mongoose from "mongoose";
import { DATABASE_URL } from "../utils/env.js";

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "db_acara",
    });

    return Promise.resolve("Database connected!");
  } catch (error) {
    return Promise.reject(error);
  }
};

export async function init() {
  try {
    const database = await connect();
    console.info("Database status: " + database);
  } catch (error) {
    console.info(error);
  }
}

export default init;
