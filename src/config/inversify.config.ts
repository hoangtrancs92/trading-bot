import { Container } from "inversify";
import { TestController } from "../controllers/test.controller";
import { TYPES } from "../types";
import { BinanceTradingController } from "../controllers/binanceTrading.controller";
import { BinanceService } from "../services/binance.service";
import { IndicatorService } from "../services/indicator.service";

// Create container DI
const container = new Container();

// Register controllers
container.bind<TestController>(TYPES.TestController).to(TestController);
container.bind<BinanceTradingController>(TYPES.BinnaceController).to(BinanceTradingController);
// Register repositories

// Register services
container.bind<BinanceService>(TYPES.BinanceService).to(BinanceService);
container.bind<IndicatorService>(TYPES.IndicatorService).to(IndicatorService);
// Register other dependencies


export default container;