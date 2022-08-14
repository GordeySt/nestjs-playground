import { IsString, IsNumber, Min, Max, IsOptional } from "class-validator";

export class CreateReviewDto {
    @IsString()
    name: string;

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @Min(1)
    @Max(5)
    @IsNumber()
    rating: number;

    @IsString()
    productId: string;
}