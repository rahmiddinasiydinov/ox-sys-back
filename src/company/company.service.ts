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
    
    // 1. Validate token with OX
    await this.oxClient.validateToken(dto.subdomain, dto.token);

    // 2. Check if company exists
    let company = await this.prisma.company.findUnique({
      where: { subdomain: dto.subdomain },
    });

    let role = user.role;

    if (!company) {
      // Create company
      company = await this.prisma.company.create({
        data: {
          subdomain: dto.subdomain,
          oxToken: dto.token,
        },
      });
      // User becomes admin
      role = 'admin';
    } else {
      // Company exists, update token if needed?
      // Requirement: "Agar kompaniya mavjud bo'lsa... manager"
      // Maybe update token? Requirement doesn't say.
    }

    // 3. Update User
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
      // "Faqat admin o'zi qo'shgan kompaniyani o'chira oladi"
      
      // Check if company exists
      const company = await this.prisma.company.findUnique({ where: { id } });
      if (!company) throw new NotFoundException('Company not found');

      // Check if user is admin
      if (user.role !== 'admin') {
          throw new ForbiddenException('Only admins can delete companies');
      }

      // Check if user belongs to this company
      // "o'zi qo'shgan" - implies ownership. 
      // Since we don't store "creatorId", we assume the current admin of the company is the owner.
      if (user.companyId !== id) {
          throw new ForbiddenException('You can only delete your own company');
      }

      // Delete company
      // This might cascade? Or just set user check null?
      // Schema: users User[] has link.
      // If I delete company, what happens to users?
      // Requirement doesn't say. I'll delete company.
      // Usually need to clean up users or set companyId null.
      // SQLite/Prisma default relation action is restrict?
      // I'll transaction it.
      
      await this.prisma.$transaction(async (tx) => {
          // Set all users in this company to have null companyId and manager role?
          // Or just delete company and let specific DB constraints handle it?
          // I will unlink users first to be safe.
          await tx.user.updateMany({
              where: { companyId: id },
              data: { companyId: null, role: 'manager' }
          });
          
          await tx.company.delete({ where: { id } });
      });

      return { message: 'Company deleted' };
  }
}
