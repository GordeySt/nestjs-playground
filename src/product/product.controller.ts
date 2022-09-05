import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { FindProductDto } from './dto/find-product.dto';
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { PRODUCT_NOT_FOUND } from "./constants/product-error.constants";
import { IdValidationPipe } from "../common/pipes/id-validation.pipe";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post('create')
    async create(@Body() dto: CreateProductDto) {
        return this.productService.create(dto);
    }

    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {
        const product = await this.productService.findById(id);

        if (!product)
            throw new NotFoundException(PRODUCT_NOT_FOUND);

        return product;
    }

    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedProduct = await this.productService.deleteById(id);

        if (!deletedProduct)
            throw new NotFoundException(PRODUCT_NOT_FOUND);
    }

    @Put(':id')
    async put(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateProductDto) {
        const updatedProduct = await this.productService.updateById(id, dto);

        if (!updatedProduct)
            throw new NotFoundException(PRODUCT_NOT_FOUND);

        return updatedProduct;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Get()
    async find(@Body() dto: FindProductDto) {
        return this.productService.findProductsWithReviews(dto);
    }
}
