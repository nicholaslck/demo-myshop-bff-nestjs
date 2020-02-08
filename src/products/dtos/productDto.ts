import { IsNotEmpty, IsUrl, IsOptional } from 'class-validator' 

export class Product {

	@IsNotEmpty()
	public name: string

	@IsOptional()
	@IsUrl()
	public imageUrl: string
}

export class ProductDto extends Product {
	
	@IsNotEmpty()
	public id: string
}