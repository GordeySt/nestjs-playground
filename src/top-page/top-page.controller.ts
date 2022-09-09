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
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from "./top-page.service";
import { CreateTopPageDto } from "./dto/create-top-page.dto";
import { IdValidationPipe } from "../common/pipes/id-validation.pipe";
import { NOT_FOUND_TOP_PAGE } from "./constants/top-page.constants";
import { HhService } from "../hh/hh.service";
import { Cron, CronExpression } from "@nestjs/schedule";

@Controller('top-page')
export class TopPageController {
    constructor(private readonly topPageService: TopPageService,
                private readonly hhService: HhService) { }

    @Post('create')
    async create(@Body() dto: CreateTopPageDto) {
        return this.topPageService.create(dto);
    }

    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {
        const page = await this.topPageService.findById(id);

        if (!page) {
            throw new NotFoundException(NOT_FOUND_TOP_PAGE);
        }
    }

    @Get('byAlias/:alias')
    async getByAlias(@Param('alias') alias: string) {
        const page = await this.topPageService.findByAlias(alias);

        if (!page) {
            throw new NotFoundException(NOT_FOUND_TOP_PAGE);
        }
    }

    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedPage = await this.topPageService.deleteById(id);

        if (!deletedPage) {
            throw new NotFoundException(NOT_FOUND_TOP_PAGE);
        }
    }

    @Put(':id')
    async put(@Param('id') id: string, @Body() dto: CreateTopPageDto) {
        const updatedPage = await this.topPageService.updateById(id, dto);

        if (!updatedPage) {
            throw new NotFoundException(NOT_FOUND_TOP_PAGE);
        }

        return updatedPage;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async find(@Body() dto: FindTopPageDto) {
        return this.topPageService.findByCategory(dto.firstCategory);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'test' })
    async test() {
        return await this.hhService.getData();
    }
}
