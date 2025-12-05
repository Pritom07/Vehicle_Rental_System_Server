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

export const vehiclesServices = { addVehicles, viewAllVehicles };
