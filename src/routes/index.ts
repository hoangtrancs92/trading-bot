import {Router} from "express";
import testRouter from "./test";
import tradingRouter from "./trading";

export default () => {
    const router = Router();
    router.use("/test", testRouter());
    router.use("/trading", tradingRouter());

    return router;
}