import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthDto } from './dto/auth.dto';
import { AuthService } from "./auth.service";
import { ALREADY_REGISTERED_ERROR } from "./constants/auth.constants";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() dto: AuthDto) {
        const oldUser = await this.authService.findUser(dto.login);

        if (oldUser) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR);
        }

        return this.authService.createUser(dto);
    }

    @HttpCode(200)
    @Post('signin')
    async logic(@Body() { login, password }: AuthDto) {
        const { email } = await this.authService.validateUser(login, password);

        return this.authService.login(email);
    }
}
