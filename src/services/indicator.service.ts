import { injectable } from "inversify";
import "reflect-metadata";
import { logger } from "../config/logger.config";
import axios from 'axios';

@injectable()
export class IndicatorService {

    async getVolumeForIntervals(coin: any, currency: any, limit: any, frame: any = 4): Promise<any[]> {
        const apiUrl = 'https://min-api.cryptocompare.com/data/v2/histominute';
        const params = {
            fsym: coin,
            tsym: currency,
            limit: limit,
            toTs: Math.floor(Date.now() / 1000),
        };

        try {
            const response = await axios.get(apiUrl, { params });
            const data = response.data.Data.Data;
            // Check the obtained data
            console.log(`Lấy được ${data.length} cây nến`);
            // Divide data into multiple ranges
            const intervals = [];
            for (let i = 0; i < frame; i++) {
                const start = i * (limit/frame);
                const end = start + (limit/frame);
                const intervalData = data.slice(start, end);

                // Calculate the total trading volume for each interval
                const totalVolume = intervalData.reduce((sum: number, minuteData: any) => {
                    return sum + minuteData.volumeto;
                }, 0);

                intervals.push({
                    interval: `${start + 1}-${end} phút`,
                    totalVolume,
                });
            }

            return intervals;
        } catch (error) {
            console.error('Error fetching data from CryptoCompare:', error);
            return [];
        }
    }
}
