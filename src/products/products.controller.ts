import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';

@Controller('products')
export class ProductsController {

	@Get()
	public getProductList() {
		return "Get Products"
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
	public getProductById(@Param() params) {
		const pid = params.pid
		return "Get Product id: " + pid
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
