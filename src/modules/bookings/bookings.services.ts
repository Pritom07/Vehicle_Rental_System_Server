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

const viewAllBookings = async () => {
  const mainQuery = await pool.query(`SELECT * FROM Bookings`);
  const mainQueryArray = mainQuery.rows;
  const result: Record<string, any>[] = [];
  for (let i = 0; i < mainQueryArray.length; i++) {
    const vehicleId = mainQueryArray[i].vehicle_id;
    const customerId = mainQueryArray[i].customer_id;

    const vehicleInfo = await pool.query(
      `SELECT vehicle_name,registration_number FROM Vehicles WHERE id=$1`,
      [vehicleId]
    );
    const vehicleInfoObj = vehicleInfo.rows[0];

    const customerInfo = await pool.query(
      `SELECT name,email FROM Users WHERE id=$1`,
      [customerId]
    );
    const customerInfoObj = customerInfo.rows[0];

    const formatDate = (dateString: string) => {
      if (
        typeof dateString === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(dateString)
      ) {
        return dateString;
      }
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const resultentObj = {
      id: mainQueryArray[i].id,
      customer_id: customerId,
      vehicle_id: vehicleId,
      rent_start_date: formatDate(mainQueryArray[i].rent_start_date),
      rent_end_date: formatDate(mainQueryArray[i].rent_end_date),
      total_price: Number(mainQueryArray[i].total_price),
      status: mainQueryArray[i].status,
      customer: customerInfoObj,
      vehicle: vehicleInfoObj,
    };
    result.push(resultentObj);
  }
  return result;
};

const viewOwnBookings = async (id: string) => {
  const mainQuery = await pool.query(
    `SELECT * FROM Bookings WHERE customer_id=$1`,
    [id]
  );

  const mainQueryArray = mainQuery.rows;
  let result: Record<string, any>[] = [];

  for (let i = 0; i < mainQueryArray.length; i++) {
    const vehicleId = mainQueryArray[i].vehicle_id;
    const vehicleInfo = await pool.query(
      `SELECT vehicle_name, registration_number, type FROM Vehicles WHERE id=$1`,
      [vehicleId]
    );

    const vehicleInfoObj = vehicleInfo.rows[0];
    const { id, customer_id, ...remainings } = mainQueryArray[i];

    const formatDate = (dateString: string) => {
      if (
        typeof dateString === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(dateString)
      ) {
        return dateString;
      }
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const resultantObj: Record<string, any> = {
      id: mainQueryArray[i].id,
      ...remainings,
      rent_start_date: formatDate(remainings.rent_start_date),
      rent_end_date: formatDate(remainings.rent_end_date),
      total_price: Number(remainings.total_price),
      vehicle: vehicleInfoObj,
    };

    result.push(resultantObj);
  }

  return result;
};

export const bookingsServices = {
  createBookings,
  viewAllBookings,
  viewOwnBookings,
};
