import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BinanceService } from "../services/binance.service";
import { TYPES } from "../types";
import { IndicatorService } from "../services/indicator.service";

@injectable()
export class BinanceTradingController {
    private _binanceService: BinanceService;
    private _indicatorService: IndicatorService;
    constructor(
        @inject(TYPES.BinanceService) binanceService: BinanceService,
        @inject(TYPES.IndicatorService) indicatorService: IndicatorService,
    ) {
        this._binanceService = binanceService;
        this._indicatorService = indicatorService;
    }

    public accountInfo = async (req: Request, res: Response): Promise<void> => {
        // const accountInfo = await this._binanceService.accountInfo();
        // const getBalanceNEAR = await this._binanceService.getSpotBalance('NEAR');
        const indicatorVal = await this._indicatorService.getVolumeForIntervals('BTC', 'USD', 60, 5);

        // const ss = await this._binanceService.init('BTCUSDT', 1);
        // console.log(ss);
        res.status(200).json({
            data: indicatorVal,
        });
    }

    public futuresAccountInfo = async (req: Request, res: Response): Promise<void> => {
        const futuresInfo = await this._binanceService.getFuturesBalance();
        const callOrder = await this._binanceService.placeOrderMinium('BTCUSDT', 'BUY', 'MARKET');

        res.status(200).json({
            success: true,
            data: callOrder,
        });
    }
}