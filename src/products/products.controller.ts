import { Controller, Get, Post, Put, Delete, Param, NotFoundException, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dtos/productDto';
import { AWSError } from 'aws-sdk';

@Controller('products')
export class ProductsController {

	constructor(private readonly productsService: ProductsService) {}

	@Get()
	public async getProductList() {
		const result = await this.productsService.readProducts()
		return result
	}

	@Post()
	public postProductList() {
		return "Post Products"
	}

	@Put()
	public putProductList() {
		return "Put Products"
	}

	@Delete()
	public deleteProductList() {
		return "Delete Products"
	}

	@Get(":pid")
	public async getProductById(@Param() params) {
		const pid = params.pid as string
		const product = await this.productsService.readProductsById(pid)
		if (!product) {
			throw new NotFoundException()
		}
		return product
	}

	@Put(":pid")
	public async putProductById(@Param() params, @Body() body: ProductDto) {
		const pid = params.pid
		try {
			return await this.productsService.writeProductById(pid, body, false)
		}
		catch (e) {
			if (e.code) {
				if ( e.code === 'ConditionalCheckFailedException') {
					throw new NotFoundException()
				}
			}
			throw e
		}
	}

	@Delete(":pid")
	public deleteProductById(@Param() params) {
		const pid = params.pid
		return "Delete Product id: " + pid
	}

}
