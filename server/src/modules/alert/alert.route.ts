import { Router } from 'express';
import AlertController from './alert.controller';
import RequestValidator from '@/middlewares/request-validator';
import { CreateAlertDto, UpdateAlertDto } from './alert.dto';

const router: Router = Router();
const controller = new AlertController();

router.get('/', controller.getAll);
router.post('/', RequestValidator.validate(CreateAlertDto), controller.create);
router.put('/:id', RequestValidator.validate(UpdateAlertDto), controller.update);
router.delete('/:id', controller.delete);

export default router;
