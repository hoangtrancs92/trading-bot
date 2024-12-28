import { client } from "../config/exchange/binance.config";
import { injectable } from "inversify";
import "reflect-metadata";
import { logger } from "../config/logger.config";
import { Candle } from "../interfaces/Candle";
import { TimeFrame } from "../config/enum/timeFrame";

let candlesData: { [key: string]: Candle[] } = {
    '4h': [],
    '30m': [],
    '5m': [],
    '1m': [],
};
@injectable()
export class BinanceService {
    async accountInfo(): Promise<any> {
        try {
            const accountInfo = await client.accountInfo();
            return accountInfo;
        } catch (error: any) {
            logger.info(error.message);
        }
    }

    async getFuturesBalance(): Promise<any> {
        try {
            const futuresBalance = await client.futuresAccountBalance();
            
            const usdtBalance = futuresBalance.find((balance: any) => balance.asset === 'USDT');
            
            if (!usdtBalance) {
                throw new Error('No USDT balance found.');
            }
        
            return {
                asset: usdtBalance.asset,
                availableBalance: parseFloat(usdtBalance.availableBalance),
                totalBalance: parseFloat(usdtBalance.balance),
            };
        } catch (error: any) {
            console.error('Error fetching futures balance:', error.message);
            throw new Error(`Error fetching futures balance: ${error.message}`);
        }
    }
    /*
     * Get the Spot balance of a specific asset
     * @params string asset (name of COIN)
    */ 
    async getSpotBalance(asset: string): Promise<any> {
        try {
        const accountInfo = await client.accountInfo();
        const balance = accountInfo.balances.find((b: any) => b.asset === asset);

        if (! balance) {
            logger.error(`Asset ${asset} not found in your account.`);
            throw new Error(`Asset ${asset} not found in your account.`);
        }

        return {
            asset: balance.asset,
            free: balance.free,
            locked: balance.locked,
        };
        } catch (error: any) {
            throw new Error(`Failed to fetch Spot balance for ${asset}: ${error.message}`);
        }
    }

    
    /*
     * Get market price of symbol
     * @params symbol:string
    */ 
    private async getMarketPrice(symbol: string): Promise<number> {
        const prices = await client.futuresPrices({ symbol });
        return parseFloat(prices[symbol]);
    }

    /*
     * place order custom
    */ 
    async placeOrder(symbol:string, notional:number, side:any, type:any, leverage:number): Promise<void> {
        try {
            // Get Futures wallet balance
            const balance = await this.getFuturesBalance();
            const availableBalance = parseFloat(balance?.availableBalance || '0');
            const minimunSymbolLot = await this.getMinimumTradeAmount(symbol);

            if (availableBalance < notional) {
                throw new Error('Insufficient balance to place order');
            }

            if (notional * leverage < minimunSymbolLot) {
                throw new Error('Insufficient balance to place order');
            }
            await client.futuresLeverage({
                symbol: symbol,
                leverage: leverage,
            });
            // Get the market price of trading pair
            const marketPrice = await this.getMarketPrice(symbol);
            
            const quantity: string = ((notional * leverage) / marketPrice).toFixed(3).toString();
            // Establish leverage cho symbol
            await client.futuresLeverage({
                symbol,
                leverage: leverage,
            });

            const order = await client.futuresOrder({
                symbol,
                side: side,
                type: type,
                quantity,
            });
            logger.info('Order placed successfully:', order);

        } catch (error: any) {
            logger.error('Error placing order:', error);
            throw new Error(`Error placing order: ${error.message}`);
        }
    }

    async placeOrderMinium(symbol:string, side:any, type:any, leverage:number = 50): Promise<void> {
        const minimunSymbolLot = await this.getMinimumTradeAmount(symbol);
        let notional = (minimunSymbolLot*2) / leverage;
        await this.placeOrder(symbol, notional, side, type, leverage)
    }

    async getMinimumTradeAmount(symbol: string): Promise<any> {
        try {
            // Lấy thông tin của sàn giao dịch
            const exchangeInfo = await client.futuresExchangeInfo();
            
            // Tìm thông tin giao dịch của cặp symbol (BTCUSDT)
            const symbolInfo = exchangeInfo.symbols.find((s) => s.symbol === symbol);
        
            if (!symbolInfo) {
                logger.error(`Symbol ${symbol} not found.`);
                return;
            }
            // Lấy các thông tin tối thiểu
            const minNotionalFilter = symbolInfo.filters.find((f) => f.filterType === 'MIN_NOTIONAL');
            // You can then safely access `notional` if it exists.
            if (minNotionalFilter) {
                return minNotionalFilter?.notional;
            }
        
        } catch (error: any) {
            logger.error('Error fetching minimum trade amount:', error.message);
        }
    }

    async fetchHistoricalCandles(symbol: string, interval: any, limit: number): Promise<Candle[]> {
        const candles = await client.candles({ symbol, interval, limit });
        console.log(candles);
        return candles.map((c) => ({
            open: parseFloat(c.open),
            high: parseFloat(c.high),
            low: parseFloat(c.low),
            close: parseFloat(c.close),
            volume: parseFloat(c.volume),
            time: c.openTime
        }));
    }

    async updateRealtimeCandles(
        symbol: string, 
        interval: string
    ) {
        try {
            client.ws.candles(symbol, interval, (candle) => {
                const newCandle: Candle = {
                    open: parseFloat(candle.open),
                    high: parseFloat(candle.high),
                    low: parseFloat(candle.low),
                    close: parseFloat(candle.close),
                    volume: parseFloat(candle.volume),
                    time: candle.startTime
                };
    
                // Kiểm tra nếu interval chưa tồn tại trong candlesData
                if (!candlesData[interval]) {
                    candlesData[interval] = [];
                }
    
                // Thêm nến mới và đảm bảo không vượt quá 500 nến
                candlesData[interval].push(newCandle);
                if (candlesData[interval].length > 500) {
                    candlesData[interval].shift(); // Xóa nến cũ nhất
                }
    
                console.log(`Updated ${interval} candles:`, candlesData['1m']);
            });
        } catch (error) {
            console.error(`Error updating candles for ${symbol} (${interval}):`, error);
        }
    }

    // Lấy dữ liệu và khởi động WebSocket
    async init(symbol: any, limit: number = 1) {
        // Lấy nến lịch sử
        candlesData[TimeFrame.FOUR_HOURS] = await this.fetchHistoricalCandles(symbol, TimeFrame.FOUR_HOURS, limit);
        candlesData[TimeFrame.FOUR_HOURS] = await this.fetchHistoricalCandles(symbol, TimeFrame.FOUR_HOURS, limit);
        candlesData[TimeFrame.THIRTY_MINUTES] = await this.fetchHistoricalCandles(symbol, TimeFrame.THIRTY_MINUTES, limit);
        candlesData[TimeFrame.FIVE_MINUTES] = await this.fetchHistoricalCandles(symbol, TimeFrame.FIVE_MINUTES, limit);
        candlesData[TimeFrame.ONE_MINUTE] = await this.fetchHistoricalCandles(symbol, TimeFrame.ONE_MINUTE, limit);
        // Khởi động cập nhật thời gian thực
        // this.updateRealtimeCandles(symbol, TimeFrame.ONE_MINUTE);

        return candlesData;
    }
  
}
