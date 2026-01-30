import { IsEnum, IsNotEmpty, IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { VisaType, AlertStatus } from '@prisma/client';

export class CreateAlertDto {
    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsEnum(VisaType)
    @IsNotEmpty()
    visaType: VisaType;
}

export class UpdateAlertDto {
    @IsEnum(AlertStatus)
    @IsOptional()
    status?: AlertStatus;
}

export class GetAlertsDto {
    @IsOptional()
    @IsString()
    cursor?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}
