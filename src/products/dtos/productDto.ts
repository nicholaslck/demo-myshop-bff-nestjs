import { IsNotEmpty, IsUppercase, IsUrl, IsOptional } from 'class-validator' 

export class ProductDto {
	
	@IsNotEmpty()
	public id: string

	@IsNotEmpty()
	public name: string

	@IsOptional()
	@IsUrl()
	public imageUrl: string
}