import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OxClientService } from '../ox/ox-client.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { User } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private oxClient: OxClientService,
  ) {}

  async register(user: User, dto: RegisterCompanyDto) {
    
    await this.oxClient.validateToken(dto.subdomain, dto.token);

    let company = await this.prisma.company.findUnique({
      where: { subdomain: dto.subdomain },
    });

    let role = user.role;

    if (!company) {
      company = await this.prisma.company.create({
        data: {
          subdomain: dto.subdomain,
          oxToken: dto.token,
        },
      });
      
      role = 'admin';
    } else {
      // Company exists, update token
      await this.prisma.company.update({
        where: { id: company.id },
        data: { oxToken: dto.token },
      }); 
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        companyId: company.id,
        role: role,
      },
    });

    return { message: 'Company registered successfully', role, companyId: company.id };
  }

  async deleteCompany(user: User, id: number) {
      const company = await this.prisma.company.findUnique({ where: { id } });
      if (!company) throw new NotFoundException('Company not found');

      if (user.role !== 'admin') {
          throw new ForbiddenException('Only admins can delete companies');
      }

      if (user.companyId !== id) {
          throw new ForbiddenException('You can only delete your own company');
      }
      
      await this.prisma.$transaction(async (tx) => {
          await tx.user.updateMany({
              where: { companyId: id },
              data: { companyId: null, role: 'manager' }
          });
          
          await tx.company.delete({ where: { id } });
      });

      return { message: 'Company deleted' };
  }
}
