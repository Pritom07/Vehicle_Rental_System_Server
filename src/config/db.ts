import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: config.postgres_connection,
});

const initTable = async () => {
  await pool.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('admin','customer');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

  await pool.query(`
       CREATE TABLE IF NOT EXISTS Users(
       id SERIAL PRIMARY KEY,
       name	VARCHAR(100) NOT NULL,
       email VARCHAR(80) UNIQUE NOT NULL CHECK (email=LOWER(email)),
       password TEXT NOT NULL CHECK (LENGTH(password)>=6),
       phone VARCHAR(15) NOT NULL,
       role user_role NOT NULL
       ) 
    `);

  await pool.query(`
      DO $$ BEGIN
        CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'van', 'SUV');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

  await pool.query(`
      DO $$ BEGIN
        CREATE TYPE vehicle_availability_status AS ENUM ('available','booked');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name TEXT NOT NULL,
    type vehicle_type NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price>0),
    availability_status vehicle_availability_status NOT NULL
    )
 `);

  await pool.query(`
      DO $$ BEGIN
        CREATE TYPE booking_status AS ENUM ('active', 'cancelled', 'returned');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Bookings(
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES Users(id),
    vehicle_id INT REFERENCES Vehicles(id),
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL CHECK (rent_end_date>rent_start_date),
    total_price NUMERIC NOT NULL CHECK (total_price>0),
    status booking_status NOT NULL
    )
    `);
};

export default initTable;
