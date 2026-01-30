import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from 'axios';
import Api from '@/lib/api';
import AlertService from './alert.service';
import { CreateAlertDto, UpdateAlertDto } from '@/dto/alert.dto';

export default class AlertController extends Api {
    private readonly alertService: AlertService;

    constructor() {
        super();
        this.alertService = new AlertService();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: CreateAlertDto = req.body;
            const alert = await this.alertService.createAlert(data);
            this.send(res, alert, HttpStatusCode.Created, 'Alert created successfully');
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cursor = req.query.cursor as string | undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

            const result = await this.alertService.getAlerts({ cursor, limit });
            this.send(res, result, HttpStatusCode.Ok, 'Alerts retrieved successfully');
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data: UpdateAlertDto = req.body;
            const alert = await this.alertService.updateAlert(id, data);
            this.send(res, alert, HttpStatusCode.Ok, 'Alert updated successfully');
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const alert = await this.alertService.deleteAlert(id);
            this.send(res, alert, HttpStatusCode.Ok, 'Alert deleted successfully');
        } catch (error) {
            next(error);
        }
    };
}
