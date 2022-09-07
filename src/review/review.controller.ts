import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { REVIEW_NOT_FOUND } from './constants/review-error.constants';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { TelegramService } from "../telegram/telegram.service";

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService,
                private readonly telegramService: TelegramService) { }

    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateReviewDto) {
       return this.reviewService.create(dto);
    }

    @UsePipes(new ValidationPipe())
    @Post('notify')
    async notify(@Body() dto: CreateReviewDto) {
        const message = `Name: ${dto.name}\n`
          + `Title: ${dto.title}\n`
          + `Description: ${dto.description}\n`
          + `Rating: ${dto.rating}\n`
          + `ProductId: ${dto.productId}\n`

        return this.telegramService.sendMessage(message);
    }

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
    @Delete('delete-by-productid/:productId')
    async deleteByProductId(@Param('productId') productId: string) {
        return this.reviewService.deleteByProductId(productId);
    }
}
