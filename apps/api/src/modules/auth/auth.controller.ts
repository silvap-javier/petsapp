import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOkResponse({ description: "Authenticate user and return access token." })
  @ApiUnauthorizedResponse({ description: "Invalid credentials." })
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas.");
    }
    return {
      ...(await this.authService.login(user)),
      user
    };
  }
}
