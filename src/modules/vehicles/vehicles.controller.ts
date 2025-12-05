import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

const addVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.addVehicles(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

const viewAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.viewAllVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

export const vehiclesController = { addVehicles, viewAllVehicles };
