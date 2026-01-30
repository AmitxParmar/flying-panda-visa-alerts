import { Prisma, VisaAlert } from '@prisma/client';
import prisma from '@/lib/prisma';

export default class AlertRepository {
    async create(data: Prisma.VisaAlertCreateInput): Promise<VisaAlert> {
        return prisma.visaAlert.create({ data });
    }

    async findAll(params: { cursor?: string; limit: number }): Promise<{ items: VisaAlert[]; nextCursor: string | null }> {
        const { cursor, limit } = params;
        const items = await prisma.visaAlert.findMany({
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            orderBy: { createdAt: 'desc' },
        });

        let nextCursor: string | null = null;
        if (items.length > limit) {
            const nextItem = items.pop();
            // Since we fetched limit+1, and skip:1 if cursor is present,
            // the last item in the list (before pop) is the one we want as the cursor for the next page?
            // No.
            // If we have items [A, B, C] and limit is 2.
            // We fetch 3 items: A, B, C.
            // We return [A, B].
            // nextCursor should be B.id (so next request does cursor: B.id, skip: 1 -> starts at C).
            //
            // Correct logic:
            // items = items.slice(0, limit); (A, B)
            // nextCursor = items[limit - 1].id; (B.id)

            // wait, if I use items.pop() I remove C.
            // The items remaining are [A, B].
            // The "next cursor" should be the ID of the last item in the returned list.
            nextCursor = items[items.length - 1].id;
        }

        return { items, nextCursor };
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
