import { Request, Response } from "express";
import { userServices } from "./users.services";

const viewAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.viewAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

const updateUsers = async (req: Request, res: Response) => {
  try {
    let result: any;
    if (req.user.role === "admin") {
      const initialResult: any = await userServices.updateUsers_AdminEnd(
        req.params.userId as string,
        req.body
      );
      const { id, name, email, password, phone, role } = initialResult.rows[0];
      result = { id, name, email, phone, role };
    } else {
      const initialResult: any = await userServices.updateUser_OwnEnd(
        req.params.userId as string,
        req.body
      );
      const { id, name, email, password, phone, role } = initialResult.rows[0];
      result = { id, name, email, phone, role };
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result: any = await userServices.deleteUser(
      req.params.userId as string
    );
    if (result > 0) {
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Sorry! you can't delete this user.`,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

export const userControllers = { viewAllUsers, updateUsers, deleteUser };
