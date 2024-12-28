import { Router } from 'express';
import { TestController } from '../controllers/test.controller';
import { TYPES } from '../types';
import container from '../config/inversify.config';

const testController = container.get<TestController>(TYPES.TestController);
export default () => {
    const testRouter = Router();
    testRouter.get('/', testController.test);

    return testRouter;
}

