import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { REVIEW_NOT_FOUND } from './constants/review-error.constants';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Post('create')
    async create(@Body() dto: CreateReviewDto) {
        return this.reviewService.create(dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const deletedDoc = await this.reviewService.delete(id);

        if (!deletedDoc) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }

    @Get('get-by-productid/:productId')
    async getByProductId(@Param('productId') productId: string) {
        return this.reviewService.findByProductId(productId);
    }

    @Delete('delete-by-productid/:productId')
    async deleteByProductId(@Param('productId') productId: string) {
        return this.reviewService.deleteByProductId(productId);
    }
}
