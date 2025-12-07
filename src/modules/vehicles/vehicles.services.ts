import { pool } from "../../config/db";

const addVehicles = async (payLoad: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payLoad;
  const result = await pool.query(
    `INSERT INTO Vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const viewAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM Vehicles`);
  return result;
};

const viewVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM Vehicles WHERE id=$1`, [id]);
  return result;
};

const updateVehicle = async (id: string, payLoad: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payLoad;

  const updates: Array<string> = [];
  const values: Array<any> = [];
  let totParameter = 1;

  if (vehicle_name !== undefined) {
    updates.push(`vehicle_name=$${totParameter}`);
    values.push(vehicle_name);
    totParameter++;
  }

  if (type !== undefined) {
    updates.push(`type=$${totParameter}`);
    values.push(type);
    totParameter++;
  }

  if (registration_number !== undefined) {
    updates.push(`registration_number=$${totParameter}`);
    values.push(registration_number);
    totParameter++;
  }

  if (daily_rent_price !== undefined) {
    updates.push(`daily_rent_price=$${totParameter}`);
    values.push(daily_rent_price);
    totParameter++;
  }

  if (availability_status !== undefined) {
    updates.push(`availability_status=$${totParameter}`);
    values.push(availability_status);
    totParameter++;
  }

  values.push(id);
  const query = `
  UPDATE Vehicles 
  SET ${updates.join(",")} 
  WHERE id=$${totParameter} RETURNING *`;

  const result = await pool.query(query, values);
  return result;
};

const deleteVehicle = async (id: string) => {
  const result = await pool.query(``);
  return result;
};

export const vehiclesServices = {
  addVehicles,
  viewAllVehicles,
  viewVehicle,
  updateVehicle,
  deleteVehicle,
};
