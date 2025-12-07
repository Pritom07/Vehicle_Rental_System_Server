import { pool } from "../../config/db";

const viewAllUsers = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role FROM Users`);
  return result;
};

export const userServices = { viewAllUsers };
