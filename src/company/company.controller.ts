import { Body, Controller, Delete, Param, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CompanyService } from './company.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminOnly } from '../common/decorators/roles.decorator';
import type { User } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('register-company')
  register(@CurrentUser() user: User, @Body() dto: RegisterCompanyDto) {
    return this.companyService.register(user, dto);
  }

  @Delete('company/:id')
  @AdminOnly()
  delete(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.companyService.deleteCompany(user, id);
  }
}
