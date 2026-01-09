import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OxClientService {
  constructor(private readonly httpService: HttpService) {}

  private getBaseUrl(subdomain: string): string {
    return `https://${subdomain}.ox-sys.com`;
  }

  async validateToken(subdomain: string, token: string): Promise<any> {
    try {
      const url = `${this.getBaseUrl(subdomain)}/profile`;
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Company is not verified. Please verify your company first.',
        403,
      );
    }
  }

  async getProducts(subdomain: string, token: string, page: number = 1, size: number = 20): Promise<any> {
    try {
        const url = `${this.getBaseUrl(subdomain)}/variations`;
        const response = await firstValueFrom(
            this.httpService.get(url, {
                params: { page, size },
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }),
        );
        return response.data;
    } catch (error) {
         throw new HttpException(
            error.response?.data || 'Failed to fetch products from OX API',
            error.response?.status || 500,
        );
    }
  }
}
