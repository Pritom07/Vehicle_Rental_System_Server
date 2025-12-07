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

const viewBookings = async (req: Request, res: Response) => {
  try {
    let result;
    if (req.user.role === "admin") {
      result = await bookingsServices.viewAllBookings();
      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
      });
    } else {
      result = await bookingsServices.viewOwnBookings(req.user.id);
      return res.status(200).json({
        success: true,
        message: "Your bookings retrieved successfully",
        data: result,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

export const bookingsController = { createBookings, viewBookings };
