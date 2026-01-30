import { Request, Response, NextFunction } from 'express';
import AlertService from './alert.service';
import { CreateAlertDto, UpdateAlertDto } from '../../dto/alert.dto';

export default class AlertController {
    private readonly alertService: AlertService;

    constructor() {
        this.alertService = new AlertService();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: CreateAlertDto = req.body;
            const alert = await this.alertService.createAlert(data);
            res.status(201).json(alert);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cursor = req.query.cursor as string | undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

            const result = await this.alertService.getAlerts({ cursor, limit });
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data: UpdateAlertDto = req.body;
            const alert = await this.alertService.updateAlert(id, data);
            res.status(200).json(alert);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const alert = await this.alertService.deleteAlert(id);
            res.status(200).json(alert);
        } catch (error) {
            next(error);
        }
    };
}
