import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { FindTopPageDto } from 'src/top-page/dto/find-top-page.dto';
import { ProductModel } from './product.model';

@Controller('product')
export class ProductController {
    @Post('create')
    async create(@Body() dto: Omit<ProductModel, '_id'>) {

    }

    @Get(':id')
    async get(@Param('id') id: string) {

    }

    @Delete(':id')
    async delete(@Param('id') id: string) {

    }

    @Put(':id')
    async put(@Param('id') id: string, @Body() dto: ProductModel) {
        
    }

    @HttpCode(200)
    @Post()
    async find(@Body() dto: FindTopPageDto) {
        
    }
}
