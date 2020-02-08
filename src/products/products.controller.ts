import { Controller, Get, Post, Put, Delete, Param, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';

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
	public putProductById(@Param() params) {
		const pid = params.pid
		return "Put Product id: " + pid
	}

	@Delete(":pid")
	public deleteProductById(@Param() params) {
		const pid = params.pid
		return "Delete Product id: " + pid
	}

}
