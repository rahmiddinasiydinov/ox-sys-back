import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OxClientService } from '../ox/ox-client.service';
import { User } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private oxClient: OxClientService,
  ) {}

  async getProducts(user: User, page: number, size: number) {
    if (size > 20) {
      throw new BadRequestException('Size cannot be greater than 20');
    }

    if (!user.companyId) {
        throw new ForbiddenException('User is not attached to any company');
    }

    const company = await this.prisma.company.findUnique({
        where: { id: user.companyId }
    });

    if (!company) {
        throw new ForbiddenException('Company not found');
    }

    return this.oxClient.getProducts(company.subdomain, company.oxToken, page, size);
  }
}
