import { Request, Response } from "express";
import { injectable } from "inversify";

@injectable()
export class TestController {
    public test = async (req: Request, res: Response): Promise<void> => {
        res.json({ message: 'Test Trading Works!' });
    }
}