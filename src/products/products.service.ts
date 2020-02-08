import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {

	constructor(private readonly configService: ConfigService) {}

	public readProducts() {
		return this.configService.get<string>("HELLO")
	}




}
