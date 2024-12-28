import { Router } from 'express';
import { TYPES } from '../types';
import container from '../config/inversify.config';
import { BinanceTradingController } from '../controllers/binanceTrading.controller';

const binanceTradingController = container.get<BinanceTradingController>(TYPES.BinnaceController);
export default () => {
    const tradingRouter = Router();
    tradingRouter.get('/binance/accountInfo', binanceTradingController.accountInfo);
    tradingRouter.get('/binance/futuresAccountInfo', binanceTradingController.futuresAccountInfo);

    return tradingRouter;
}

