import { Router } from "express";
import userrouter from "./users.route.js";
import customerrouter from "./customers.router.js";
import expenseroute from "./expenses.router.js";
import DashboardRouter from "./dashboard.router.js";

const routers = Router();

routers.use("/users", userrouter);
routers.use("/customer", customerrouter);
routers.use("/expenses",expenseroute);
routers.use("/Dashboard", DashboardRouter);

export default routers;
