import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
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
