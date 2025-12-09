import { pool } from "../../config/db";

const viewAllUsers = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role FROM Users`);
  return result;
};

const updateUsers_AdminEnd = async (
  id: string,
  payLoad: Record<string, unknown>
) => {
  const { name, email, phone, role } = payLoad;
  const updates: Array<string> = [];
  const values: Array<any> = [];
  let totParam = 1;

  if (name !== undefined) {
    updates.push(`name=$${totParam}`);
    values.push(name);
    totParam++;
  }

  if (email !== undefined) {
    updates.push(`email=$${totParam}`);
    values.push(email);
    totParam++;
  }

  if (phone !== undefined) {
    updates.push(`phone=$${totParam}`);
    values.push(phone);
    totParam++;
  }

  if (role !== undefined) {
    updates.push(`role=$${totParam}`);
    values.push(role);
    totParam++;
  }

  values.push(id);

  const query = `
  UPDATE Users
  SET ${updates.join(",")}
  WHERE id=$${totParam}
  RETURNING *
  `;

  const result = await pool.query(query, values);
  return result;
};

const updateUser_OwnEnd = async (
  id: string,
  payLoad: Record<string, unknown>
) => {
  const { name, email, password, phone } = payLoad;
  const updates: Array<string> = [];
  const values: Array<any> = [];
  let totParam = 1;

  if (name !== undefined) {
    updates.push(`name=$${totParam}`);
    values.push(name);
    totParam++;
  }

  if (email !== undefined) {
    updates.push(`email=$${totParam}`);
    values.push(email);
    totParam++;
  }

  if (password !== undefined) {
    updates.push(`password=$${totParam}`);
    values.push(password);
    totParam++;
  }

  if (phone !== undefined) {
    updates.push(`phone=$${totParam}`);
    values.push(phone);
    totParam++;
  }

  values.push(id);

  const query = `
  UPDATE Users
  SET ${updates.join(",")}
  WHERE id=$${totParam}
  RETURNING *
  `;

  const result = await pool.query(query, values);
  return result;
};

const deleteUser = async (userId: string) => {
  const subQuery = await pool.query(
    `SELECT status FROM Bookings WHERE customer_id=$1 ORDER BY rent_start_date DESC LIMIT 1`,
    [userId]
  );
  const { status } = subQuery.rows[0];
  if (status !== "active") {
    const mainQuery = await pool.query(
      `DELETE FROM Users WHERE id=$1 RETURNING *`,
      [userId]
    );
    return mainQuery.rowCount;
  }
  return 0;
};

export const userServices = {
  viewAllUsers,
  updateUsers_AdminEnd,
  updateUser_OwnEnd,
  deleteUser,
};
