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

  public static async getOrdersByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const orders = await orderService.getOrdersByUser(userId);
      return res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 20;
      const status = (req.query.status as string) || undefined;
      const result = await orderService.getAllOrders(page, size, status);
      return res.status(200).json({
        success: true,
        data: result.data,
        meta: { page, size, total: result.total, totalPages: Math.ceil(result.total / size) },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { orderStatus, paymentStatus } = req.body;
      if (!orderStatus) {
        return res.status(400).json({ success: false, message: "orderStatus is required" });
      }
      const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
      if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({ success: false, message: `Invalid orderStatus. Must be one of: ${validStatuses.join(", ")}` });
      }
      const order = await orderService.updateOrderStatus(id, orderStatus, paymentStatus);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.status(200).json({ success: true, message: "Order status updated", order });
    } catch (error) {
      next(error);
    }
  }
}
