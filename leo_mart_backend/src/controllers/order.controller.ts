import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order_service";

const orderService = new OrderService();

export class OrderController {
  public static async createCodOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerInfo, shippingAddress, items } = req.body;

      if (!customerInfo || !customerInfo.fullname || !customerInfo.email || !customerInfo.phone) {
        return res.status(400).json({
          success: false,
          message: "Customer name, email, and phone are required",
        });
      }

      if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.district) {
        return res.status(400).json({
          success: false,
          message: "Complete shipping address (street, city, district) is required",
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart items are required to place an order",
        });
      }

      const userId = req.user?.id;

      const order = await orderService.createCodOrder({
        userId,
        customerInfo,
        shippingAddress,
        items,
      });

      return res.status(201).json({
        success: true,
        message: "Order placed successfully with Cash on Delivery",
        order,
      });
    } catch (error: any) {
      next(error);
    }
  }

  public static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.status(200).json({ success: true, order });
    } catch (error) {
      next(error);
    }
  }
}
