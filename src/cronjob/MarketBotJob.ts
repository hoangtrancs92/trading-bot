import cron from "node-cron";
import { IndicatorService } from "../services/indicator.service";
import { determineTrendByVolumne, calculateRSI, calculateSMAAndDetermineTrend, calculateMACD } from "../utils/formular.util";
import { VolumeInterval } from "../interfaces/volumnInterval";
import { BinanceService } from "../services/binance.service";
import { Candle } from "../interfaces/Candle";
import { Trend } from "../config/enum/trend";

export const BinanceBotJob = () => {
  // Define cronjob to run every 3 minutes
  cron.schedule("*/5 * * * * *", () => {
        const indicatorService = new IndicatorService();
        const binanceService = new BinanceService();
        // Call async function in cronjob
        (async () => {
        try {
            const btc = await tradingBTC(indicatorService, binanceService);
            const eth = await tradingETH(indicatorService, binanceService);
            const sol = await tradingSOL(indicatorService, binanceService);
            const xrp = await tradingXRP(indicatorService, binanceService);


            // console.log(btc);
            // console.log(eth);
            console.log(`[Cronjob] Running at ${new Date().toISOString()}`);
        } catch (error) {
            console.error("[Cronjob] Error while trading BTC:", error);
        }
    })();
});

};

async function tradingBTC(indicatorService: IndicatorService, binanceService: BinanceService) {
    console.log('---------------- BTC ----------------------------------------------------------------');
    const symbol = 'BTCUSDT'; // Cặp tiền tệ, ví dụ BTCUSDT
    const interval = '30m';    // Khoảng thời gian cho mỗi nến, ví dụ: '1m', '5m', '1h', '1d'
    const limit = 35;        // Số lượng nến bạn muốn lấy
    const candles: Candle[] = await binanceService.fetchHistoricalCandles(symbol, interval, limit);

    const closePrices = candles.map((candle) => candle.close);
    const tradingVolume: VolumeInterval[] = await indicatorService.getVolumeForIntervals('BTC', 'USD', 524, 35);

    const closeVolume = tradingVolume.map((volume) =>volume.totalVolume);
    const condition01 = await calculateSMAAndDetermineTrend(closeVolume, 12, 16);
    const condition02 = await calculateRSI(closePrices);
    const condition03 = await calculateSMAAndDetermineTrend(closePrices, 12, 16);
    const { macd, signalLine } = await calculateMACD(closePrices, 12, 26, 9);
    const last8Candles = candles.slice(-8).map(candle => ({
        open: candle.open,
        close: candle.close
    }));
    const last8VolumeCloseOfCandle = tradingVolume.slice(-8).map((volume) =>volume.totalVolume);
    const condition04 = await determineTrendFromMACD(macd, signalLine);
    const condition05 = await volumeBasedEntry(last8VolumeCloseOfCandle, last8Candles);
    return condition01;
}

async function tradingXRP(indicatorService: IndicatorService, binanceService: BinanceService) {
    console.log('---------------- XRP ----------------------------------------------------------------');
    const symbol = 'XRPUSDT'; // Cặp tiền tệ, ví dụ BTCUSDT
    const interval = '15m';    // Khoảng thời gian cho mỗi nến, ví dụ: '1m', '5m', '1h', '1d'
    const limit = 35;        // Số lượng nến bạn muốn lấy
    const candles: Candle[] = await binanceService.fetchHistoricalCandles(symbol, interval, limit);
    const closePrices = candles.map((candle) => candle.close);
    const tradingVolume: VolumeInterval[] = await indicatorService.getVolumeForIntervals('XRP', 'USD', 524, 35);
    const closeVolume = tradingVolume.map((volume) =>volume.totalVolume);
    const condition01 = await calculateSMAAndDetermineTrend(closeVolume, 12, 16);
    const condition02 = await calculateRSI(closePrices);
    const condition03 = await calculateSMAAndDetermineTrend(closePrices, 12, 16);
    const { macd, signalLine } = await calculateMACD(closePrices, 12, 26, 9);
    const last8Candles = candles.slice(-8).map(candle => ({
        open: candle.open,
        close: candle.close
    }));
    const last8VolumeCloseOfCandle = tradingVolume.slice(-8).map((volume) =>volume.totalVolume);
    const condition04 = await determineTrendFromMACD(macd, signalLine);
    const condition05 = await volumeBasedEntry(last8VolumeCloseOfCandle, last8Candles);
    
}

async function tradingETH(indicatorService: IndicatorService, binanceService: BinanceService) {
    console.log('---------------- ETH ----------------------------------------------------------------');
    const symbol = 'ETHUSDT'; // Cặp tiền tệ, ví dụ BTCUSDT
    const interval = '15m';    // Khoảng thời gian cho mỗi nến, ví dụ: '1m', '5m', '1h', '1d'
    const limit = 35;        // Số lượng nến bạn muốn lấy
    const candles: Candle[] = await binanceService.fetchHistoricalCandles(symbol, interval, limit);
    const closePrices = candles.map((candle) => candle.close);
    const tradingVolume: VolumeInterval[] = await indicatorService.getVolumeForIntervals('ETH', 'USD', 524, 35);
    const closeVolume = tradingVolume.map((volume) =>volume.totalVolume);
    const condition01 = await calculateSMAAndDetermineTrend(closeVolume, 12, 16);
    const condition02 = await calculateRSI(closePrices);
    const condition03 = await calculateSMAAndDetermineTrend(closePrices, 12, 16);
    const { macd, signalLine } = await calculateMACD(closePrices, 12, 26, 9);
    const last8Candles = candles.slice(-8).map(candle => ({
        open: candle.open,
        close: candle.close
    }));
    const last8VolumeCloseOfCandle = tradingVolume.slice(-8).map((volume) =>volume.totalVolume);
    const condition04 = await determineTrendFromMACD(macd, signalLine);
    const condition05 = await volumeBasedEntry(last8VolumeCloseOfCandle, last8Candles);
}

async function tradingSOL(indicatorService: IndicatorService, binanceService: BinanceService) {
    console.log('---------------- SOL ----------------------------------------------------------------');
    const symbol = 'SOLUSDT'; // Cặp tiền tệ, ví dụ BTCUSDT
    const interval = '15m';    // Khoảng thời gian cho mỗi nến, ví dụ: '1m', '5m', '1h', '1d'
    const limit = 35;        // Số lượng nến bạn muốn lấy
    const candles: Candle[] = await binanceService.fetchHistoricalCandles(symbol, interval, limit);
    const closePrices = candles.map((candle) => candle.close);
    const tradingVolume: VolumeInterval[] = await indicatorService.getVolumeForIntervals('SOL', 'USD', 524, 35);
    const closeVolume = tradingVolume.map((volume) =>volume.totalVolume);
    const condition01 = await calculateSMAAndDetermineTrend(closeVolume, 12, 16);
    const condition02 = await calculateRSI(closePrices);
    const condition03 = await calculateSMAAndDetermineTrend(closePrices, 12, 16);
    const { macd, signalLine } = await calculateMACD(closePrices, 12, 26, 9);
    const last8Candles = candles.slice(-8).map(candle => ({
        open: candle.open,
        close: candle.close
    }));
    const last8VolumeCloseOfCandle = tradingVolume.slice(-8).map((volume) =>volume.totalVolume);
    const condition04 = await determineTrendFromMACD(macd, signalLine);
    const condition05 = await volumeBasedEntry(last8VolumeCloseOfCandle, last8Candles);
}

async function determineTrendFromMACD(macd: number[], signalLine: number[]) {
    // Lấy giá trị MACD và Signal Line cuối cùng và trước đó
    const lastMACD = macd[macd.length - 1];
    const lastSignalLine = signalLine[signalLine.length - 1];
    const previousMACD = macd[macd.length - 2];
    const previousSignalLine = signalLine[signalLine.length - 2];

    // Quy tắc xác định xu hướng từ MACD và Signal Line
    if (lastMACD > lastSignalLine && previousMACD <= previousSignalLine) {
        console.log('uptrend');
        return "Bullish (Tăng)";  // Tín hiệu tăng
    }
    if (lastMACD < lastSignalLine && previousMACD >= previousSignalLine) {
        console.log('downtrend');  // Tín hiệu giảm
        return "Bearish (Giảm)";  // Tín hiệu giảm
    }
    console.log('sideways');
    return "Sideways";
}

function volumeBasedEntry(
    volumes: number[], 
    candles: { open: number; close: number }[], 
    threshold: number = 1.025 // Tăng 3%
): any {
    const len = volumes.length;

    // Kiểm tra nếu không đủ dữ liệu
    if (len < 2 || volumes.length !== candles.length) {
        return "Không đủ dữ liệu hoặc dữ liệu không hợp lệ.";
    }

    // Tính trung bình khối lượng của các cây nến trước đó
    const avgVolume = volumes.slice(0, len - 1).reduce((sum, volume) => sum + volume, 0) / (len - 1);

    // Lấy khối lượng và giá mở/đóng hiện tại
    const currentVolume = volumes[len - 1];
    const currentCandle = candles[len - 1];

    // Kiểm tra khối lượng có tăng ít nhất 3% hay không
    const isVolumeSpike = currentVolume > avgVolume * threshold;

    // Kiểm tra nến tăng hay giảm
    if (isVolumeSpike) {
        if (currentCandle.close > currentCandle.open) {
            console.log('uptrend');
            return Trend.UP_TRENDS; // Khối lượng tăng 3% + nến tăng → Mua
        } else if (currentCandle.close < currentCandle.open) {
            console.log('downtrend'); // Khối lượng tăng 3% + nến giảm → Bán
            return Trend.DOWN_TRENDS;
        }
    }
    console.log('sideways');  // Không có tín hiệu giao dịch
    return Trend.SIDE_WAYS;
}