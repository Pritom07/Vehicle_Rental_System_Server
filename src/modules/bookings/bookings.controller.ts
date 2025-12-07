import { Request, Response } from "express";
import { bookingsServices } from "./bookings.services";

const createBookings = async (req: Request, res: Response) => {
  try {
    const initialResult = await bookingsServices.createBookings(req.body);
    const { mainQuery, subQuery } = initialResult;
    const mainQueryResult = mainQuery.rows[0];
    const subQueryResult = subQuery.rows[0];
    mainQueryResult["vehicle"] = subQueryResult;
    mainQueryResult.total_price = Number(mainQueryResult.total_price);
    mainQueryResult.vehicle.daily_rent_price = Number(
      mainQueryResult.vehicle.daily_rent_price
    );
    const result = mainQueryResult;
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

export const bookingsController = { createBookings };
