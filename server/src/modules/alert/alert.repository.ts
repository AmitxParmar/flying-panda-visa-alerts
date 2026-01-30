import { Prisma, VisaAlert } from '@prisma/client';
import prisma from '@/lib/prisma';

export default class AlertRepository {
    async create(data: Prisma.VisaAlertCreateInput): Promise<VisaAlert> {
        return prisma.visaAlert.create({ data });
    }

    async findAll(): Promise<VisaAlert[]> {
        return prisma.visaAlert.findMany();
    }

    async findById(id: string): Promise<VisaAlert | null> {
        return prisma.visaAlert.findUnique({ where: { id } });
    }

    async update(id: string, data: Prisma.VisaAlertUpdateInput): Promise<VisaAlert> {
        return prisma.visaAlert.update({ where: { id }, data });
    }

    async delete(id: string): Promise<VisaAlert> {
        return prisma.visaAlert.delete({ where: { id } });
    }
}
