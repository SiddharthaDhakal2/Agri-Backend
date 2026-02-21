import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { PaymentController } from "../controllers/payment.controller";

const paymentController = new PaymentController();
const router = Router();

router.post("/khalti/initiate", requireAuth, paymentController.initiateKhaltiPayment);
router.post("/khalti/verify", requireAuth, paymentController.verifyKhaltiPayment);

export default router;
