import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { ProductController } from "../controllers/product.controller";

const productController = new ProductController();
const router = Router();

router.post("/", requireAuth, requireAdmin, productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProducts);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/:id", productController.getProductById);
router.put("/:id", requireAuth, requireAdmin, productController.updateProduct);
router.delete("/:id", requireAuth, requireAdmin, productController.deleteProduct);
router.patch("/:id/stock", requireAuth, requireAdmin, productController.updateStock);

export default router;
