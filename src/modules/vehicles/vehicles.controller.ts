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

const viewVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.viewVehicle(
      req.params.vehicleId as string
    );
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.updateVehicle(
      req.params.vehicleId as string,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result: any = await vehiclesServices.deleteVehicle(
      req.params.vehicleId as string
    );
    if (result > 0) {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Sorry! you can't delete this vehicle.`,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

export const vehiclesController = {
  addVehicles,
  viewAllVehicles,
  viewVehicle,
  updateVehicle,
  deleteVehicle,
};
