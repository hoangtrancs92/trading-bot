import { Trend } from "../config/enum/trend";
import { VolumeInterval } from "../interfaces/volumnInterval";

export function determineTrendByVolumne(
    volumes: VolumeInterval[],
    condition1Threshold: number = 0.7,
    condition2Threshold: number = 0.8,
    sidewaysThresholdLow: number = 0.85,
    sidewaysThresholdHigh: number = 1.15,
    frame: number = 7, // Thêm tham số frame để linh hoạt thay đổi số lượng khung
    errorTolerance: number = 0.1 // Đặt sai số 3%
): any {
    const len = volumes.length;
    console.log(volumes);
    if (len < frame) {
        return "Không đủ dữ liệu để xác định xu thế"; // Cần ít nhất số lượng khung đã cho
    }

    // Lấy khối lượng cuối và khối lượng kế cuối
    const lastVolume = volumes[len - 1].totalVolume;
    const secondLastVolume = volumes[len - 2].totalVolume;

    // Tính trung bình của các khung trước đó
    const previousVolumes = volumes.slice(len - frame - 1, len - 1); // Lấy frame khung trước
    const averagePrevious = previousVolumes.reduce((sum, v) => sum + v.totalVolume, 0) / previousVolumes.length;

    // Kiểm tra điều kiện 1: Nhỏ hơn tỷ lệ của khối lượng kế cuối
    const isCondition1Met = lastVolume < secondLastVolume * condition1Threshold;

    // Kiểm tra điều kiện 2: Nhỏ hơn ít nhất 5 trong 6 khung gần nhất
    const recentVolumes = volumes.slice(len - 6, len - 1); // Lấy 5 khung gần nhất
    const condition2MetCount = recentVolumes.filter(v => lastVolume < v.totalVolume).length; // Đếm số khung có khối lượng nhỏ hơn lastVolume
    const isCondition2Met = condition2MetCount >= 5; // Kiểm tra nếu ít nhất 5 khung có khối lượng nhỏ hơn

    // Kiểm tra điều kiện sideways: ± tỷ lệ của trung bình các khung trước đó với sai số
    const sidewaysLowerBound = averagePrevious * sidewaysThresholdLow * (1 - errorTolerance);
    const sidewaysUpperBound = averagePrevious * sidewaysThresholdHigh * (1 + errorTolerance);

    // Kiểm tra nếu khối lượng nằm trong phạm vi ± sai số của trung bình 6 khung trước đó
    const isSideways = recentVolumes.filter(v =>
        v.totalVolume >= sidewaysLowerBound && v.totalVolume <= sidewaysUpperBound
    ).length >= 5;

    // Kết luận xu thế
    if (isCondition1Met && isCondition2Met) {
        console.log('downtrend');
        return Trend.DOWN_TRENDS;
    } else if (isSideways) {
        console.log('sideway');
        return Trend.SIDE_WAYS;
    } else {
        console.log('uptrend');
        return Trend.UP_TRENDS;
    }
}

export function calculateRSI(prices: number[], period: number = 14, errorTolerance: number = 0.03): any {
    // Lọc bỏ các giá trị NaN trong dãy giá
    const cleanPrices = prices.filter(price => !isNaN(price));
    if (cleanPrices.length < period) {
        return "Không đủ dữ liệu để tính RSI.";
    }

    let gains: number[] = [];
    let losses: number[] = [];
    // Tính Gain và Loss cho mỗi kỳ
    for (let i = 1; i < cleanPrices.length; i++) {
        const change = cleanPrices[i] - cleanPrices[i - 1];
        if (change >= 0) {
            gains.push(change);
            losses.push(0);
        } else {
            gains.push(0);
            losses.push(Math.abs(change));
        }
    }

    // Tính Average Gain và Average Loss cho chu kỳ đầu tiên
    let averageGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let averageLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
    if (averageLoss === 0) {
        return "RSI không thể tính do không có Loss (chỉ có Gains).";
    }

    let rs = averageGain / (averageLoss === 0 ? 1 : averageLoss); // Tránh chia cho 0
    let rsi = [100 - (100 / (1 + rs))]; // RSI cho kỳ đầu tiên

    // Tính cho các kỳ tiếp theo
    for (let i = period; i < cleanPrices.length; i++) {
        const gain = gains[i];
        const loss = losses[i];

        // Tính Average Gain và Average Loss động
        averageGain = (averageGain * (period - 1) + gain) / period;
        averageLoss = (averageLoss * (period - 1) + loss) / period;

        if (averageLoss === 0) {
            rs = Infinity; // Nếu không có loss, RS sẽ là vô cực (xu hướng cực mạnh).
        } else {
            rs = averageGain / averageLoss; // Tính RS bình thường
        }

        const calculatedRSI = 100 - (100 / (1 + rs));

        // Chỉ thêm vào mảng nếu không phải NaN
        if (!isNaN(calculatedRSI)) {
            rsi.push(calculatedRSI);
        }
    }

    // Tính trung bình của RSI
    const averageRSI = rsi.reduce((sum, current) => sum + current, 0) / rsi.length;

    // Đưa ra kết luận dựa trên RSI trung bình
    if (averageRSI > 70) {
        console.log(`RSI trung bình: ${averageRSI.toFixed(2)}\nThị trường quá mua (Overbought). Có thể có sự điều chỉnh giảm.`);
        return Trend.DOWN_TRENDS;
    } else if (averageRSI < 30) {
        console.log(`RSI trung bình: ${averageRSI.toFixed(2)}\nThị trường quá bán (Oversold). Có thể có sự phục hồi.`)
        return Trend.UP_TRENDS;
    } else {
        console.log(`RSI trung bình: ${averageRSI.toFixed(2)}\nThị trường trong trạng thái trung lập (Sideways). Không có xu hướng rõ ràng.`);
        return Trend.SIDE_WAYS;
    }
}

// Tính EMA cho khối lượng giao dịch, tính từ dưới lên
export function calculateEMA(volumes: number[], period: number): number[] {
    const alpha = 2 / (period + 1); // Tính hệ số làm mịn alpha
    const ema: number[] = new Array(volumes.length);  // Khởi tạo mảng EMA rỗng có độ dài bằng mảng volumes
    let previousEma = volumes[0];  // Khởi tạo EMA đầu tiên bằng giá trị volume đầu tiên

    // Duyệt mảng từ đầu đến cuối và tính EMA cho từng volume
    for (let i = 1; i < volumes.length; i++) {
        const currentVolume = volumes[i];
        const emaValue = (currentVolume * alpha) + (previousEma * (1 - alpha));
        ema[i] = emaValue;
        previousEma = emaValue;  // Cập nhật giá trị EMA để dùng cho lần tính tiếp theo
    }

    // Lọc bỏ các giá trị NaN trong mảng EMA
    return ema.filter(value => !isNaN(value));
}



export function calculateSMAAndDetermineTrend(prices: number[],
    shortPeriod: number,
    longPeriod: number) {
    // Tính SMA cho chu kỳ ngắn hạn và dài hạn
    const smaShort = calculateEMA(prices, shortPeriod);
    const smaLong = calculateEMA(prices, longPeriod);
    // Kiểm tra xem mảng SMA có đủ dài để so sánh không
    if (smaShort.length < 2 || smaLong.length < 2) {
        return "Không đủ dữ liệu để xác định xu thế";
    }
    // Lấy các giá trị SMA cuối cùng và giá trị SMA trước đó
    const lastShort = smaShort[smaShort.length - 1];
    const lastLong = smaLong[smaLong.length - 1];
    const previousShort = smaShort[smaShort.length - 2];
    const previousLong = smaLong[smaLong.length - 2];

    // Kiểm tra xu thế (Uptrend, Downtrend, Sideways)
    if (lastShort > lastLong && lastShort > previousShort && lastLong > previousLong) {
        console.log("Uptrend");  // Xu hướng tăng
        return Trend.UP_TRENDS;
    }
    if (lastShort < lastLong && lastShort < previousShort && lastLong < previousLong) {
        console.log("Downtrend");  // Xu hướng giảm
        return Trend.DOWN_TRENDS;
    }

    console.log("Sideways");
    return Trend.SIDE_WAYS;
}

export function calculateMACD(prices: number[], shortPeriod: number, longPeriod: number, signalPeriod: number) {
    // Đảm bảo mảng giá đóng đủ dài
    if (prices.length < longPeriod) {
        throw new Error("Không đủ dữ liệu để tính toán MACD.");
    }

    // Tính EMA ngắn hạn (Short) và dài hạn (Long)
    const shortEMA = calculateEMA(prices, shortPeriod);
    const longEMA = calculateEMA(prices, longPeriod);

    // Tính MACD = EMA(Short) - EMA(Long)
    const macd = shortEMA.map((value, index) => value - longEMA[index]);

    // Tính Dòng tín hiệu = EMA(MACD, Signal Period)
    const signalLine = calculateEMA(macd, signalPeriod);

    return {
        macd,
        signalLine
    };
}