import { VisaAlert } from '@prisma/client';
import AlertRepository from './alert.repository';
import { CreateAlertDto, UpdateAlertDto } from '../../dto/alert.dto';
import { HttpNotFoundError } from '@/lib/errors';

export default class AlertService {
    private readonly alertRepository: AlertRepository;

    constructor() {
        this.alertRepository = new AlertRepository();
    }

    async createAlert(data: CreateAlertDto): Promise<VisaAlert> {
        return this.alertRepository.create(data);
    }

    async getAlerts(params: { cursor?: string; limit: number }): Promise<{ items: VisaAlert[]; nextCursor: string | null }> {
        return this.alertRepository.findAll(params);
    }

    async updateAlert(id: string, data: UpdateAlertDto): Promise<VisaAlert> {
        const alert = await this.alertRepository.findById(id);
        if (!alert) {
            throw new HttpNotFoundError('Alert not found');
        }
        return this.alertRepository.update(id, data);
    }

    async deleteAlert(id: string): Promise<VisaAlert> {
        const alert = await this.alertRepository.findById(id);
        if (!alert) {
            throw new HttpNotFoundError('Alert not found');
        }
        return this.alertRepository.delete(id);
    }
}
