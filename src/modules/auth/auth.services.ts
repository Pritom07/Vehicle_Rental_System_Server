import config from "../../config";
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signUpUsers = async (payLoad: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payLoad;
  const hashedPassword: string = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO Users(name, email, password, phone, role ) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );
  return result;
};

const signInUsers = async (payLoad: Record<string, unknown>) => {
  const { email, password } = payLoad;
  const result: any = await pool.query(`SELECT * FROM Users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length > 0) {
    const user = result.rows[0];
    const matched = await bcrypt.compare(password as string, user.password);
    if (matched) {
      const secret: any = config.jwtSecret;
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        secret,
        {
          expiresIn: "4d",
        }
      );
      return { user, token };
    }
  }
};

export const authServices = { signUpUsers, signInUsers };
