import { Request, Response, NextFunction } from "express";
import { KhaltiService } from "../services/khalti_service";

const khaltiService = new KhaltiService();

export class PaymentController {
  /**
   * Initiate Khalti ePayment v2
   * Endpoint: POST /api/v1/payment/khalti/initiate
   */
  public static async initiateKhalti(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerInfo, shippingAddress, items, couponCode } = req.body;

      if (!customerInfo || !customerInfo.fullname || !customerInfo.email || !customerInfo.phone) {
        return res.status(400).json({
          success: false,
          message: "Customer name, email, and phone number are required",
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
          message: "Cart items are required to initiate payment",
        });
      }

      const userId = req.user?.id;

      const result = await khaltiService.initiatePayment({
        userId,
        customerInfo,
        shippingAddress,
        items,
        couponCode,
      });

      return res.status(200).json({
        success: true,
        message: "Khalti payment initiated successfully",
        payment_url: result.payment_url,
        pidx: result.pidx,
        purchaseOrderId: result.purchaseOrderId,
      });
    } catch (error: any) {
      console.error("Khalti Initiate Error:", error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        message: error.response?.data?.detail || error.message || "Failed to initiate Khalti payment",
      });
    }
  }

  /**
   * Verify Khalti ePayment v2 Lookup
   * Endpoint: POST /api/v1/payment/khalti/verify
   */
  public static async verifyKhalti(req: Request, res: Response, next: NextFunction) {
    try {
      const { pidx } = req.body;
      if (!pidx) {
        return res.status(400).json({
          success: false,
          message: "pidx parameter is required for payment verification",
        });
      }

      const result = await khaltiService.verifyPayment(pidx);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          order: result.order,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error: any) {
      console.error("Khalti Verification Error:", error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        message: error.response?.data?.detail || error.message || "Khalti payment verification failed",
      });
    }
  }
}
