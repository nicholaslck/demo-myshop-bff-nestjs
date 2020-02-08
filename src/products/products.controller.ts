import { Controller, Get, Post, Put, Delete, Param, NotFoundException, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto , Product } from './dtos/productDto';
import { ArrayValidationPipe, QueryArrayValidationPipe } from 'src/validation.pipe';

@Controller('products')
export class ProductsController {

	constructor(private readonly productsService: ProductsService) {}

	@Get()
	public async getProductList() {
		return await this.productsService.readProducts()
	}

	@Post()
	public async postProductList(@Body(new ArrayValidationPipe(Product)) body: Array<Product>) {
		return await this.productsService.createProducts(body)
	}

	@Put()
	public async putProductList(@Body(new ArrayValidationPipe(ProductDto)) body: Array<ProductDto>) {
		return this.productsService.updateProducts(body)
	}

	@Delete()
	public async deleteProductList(@Query("ids", new QueryArrayValidationPipe(String)) query: Array<string>) {
		return await this.productsService.deleteProducts(query)
	}

	@Get(":pid")
	public async getProductById(@Param() params) {
		const product = await this.productsService.readProductsById(params.pid as string)
		if (!product) {
			throw new NotFoundException()
		}
		return product
	}

	@Put(":pid")
	public async putProductById(@Param() params, @Body() body: Product) {
		try {
			return await this.productsService.updateProductById(params.pid as string, body)
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
	public async deleteProductById(@Param() params) {
		await this.productsService.deleteProductById(params.pid)
	}
}
