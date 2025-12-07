import { pool } from "../../config/db";

const createBookings = async (payLoad: Record<string, any>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payLoad;
  const subQuery = await pool.query(
    `SELECT vehicle_name, daily_rent_price FROM Vehicles WHERE id=$1`,
    [vehicle_id]
  );

  const { vehicle_name, daily_rent_price } = subQuery.rows[0];
  const rentEndDate: Date = new Date(rent_end_date);
  const rentStartDate: Date = new Date(rent_start_date);
  const days = Math.ceil(
    (rentEndDate.getTime() - rentStartDate.getTime()) / (24 * 60 * 60 * 1000)
  );
  const total_price = days * Number(daily_rent_price);

  const mainQuery = await pool.query(
    `INSERT INTO Bookings(customer_id, vehicle_id, rent_start_date, rent_end_date,total_price,status) VALUES($1,$2,$3, $4,$5,$6) RETURNING  id,
       customer_id,
       vehicle_id,
       TO_CHAR(rent_start_date, 'YYYY-MM-DD') as rent_start_date,
       TO_CHAR(rent_end_date, 'YYYY-MM-DD') as rent_end_date,
       total_price,
       status`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  await pool.query(`UPDATE Vehicles SET availability_status=$1 WHERE id=$2`, [
    "booked",
    vehicle_id,
  ]);

  const result = { mainQuery, subQuery };
  return result;
};

export const bookingsServices = { createBookings };
