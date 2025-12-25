import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/adminAuth.controller";

const router = Router();

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

export default router;