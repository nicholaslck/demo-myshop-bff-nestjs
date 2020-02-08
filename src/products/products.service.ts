import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { GetItemInput, ScanInput, PutItemInput, DeleteItemInput, BatchWriteItemInput, WriteRequest } from 'aws-sdk/clients/dynamodb';
import { ProductDto , Product } from './dtos/productDto';
import uuid = require('uuid');

@Injectable()
export class ProductsService {

	constructor(private readonly configService: ConfigService) {}

	private ddb() {
		return new AWS.DynamoDB({
			apiVersion: '2012-08-10',
			accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
			secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY"),
			region: this.configService.get<string>("DDB_REGION")
		})
	}

	private tableName() {
		return this.configService.get<string>("DDB_PRODUCTS_TABLE_NAME")
	}

	public async readProducts() {

		const ddb = this.ddb()

		const param : ScanInput = {
			TableName: this.tableName()
		}
		const result = await ddb.scan(param).promise()
		const parsed = result.Items.map((item) => {
			return AWS.DynamoDB.Converter.unmarshall(item)
		})
		return parsed
	}

	public async readProductsById(pid: string) {

		const ddb = this.ddb()

		const param: GetItemInput = {
			TableName: this.tableName(),
			Key: AWS.DynamoDB.Converter.marshall({id: pid})
		}
		
		const result = await ddb.getItem(param).promise()

		if (!result.Item) {
			return null
		}
		return AWS.DynamoDB.Converter.unmarshall(result.Item)
	}

	public async createProduct(product: Product) {
		const productDto: ProductDto = {
			...product,
			id: uuid()
		}

		const ddb = this.ddb()
		const param : PutItemInput = {
			TableName: this.tableName(),
			Item: AWS.DynamoDB.Converter.marshall(productDto),
			ConditionExpression: "attribute_not_exists(id)"
		}
		
		await ddb.putItem(param).promise()
		return productDto
	}

	public async createProducts(productList: Array<Product>) {
		
		const productDtos = productList.map((product) => {
			const dto: ProductDto = {
				...product,
				id: uuid()
			}
			return dto
		})

		const requests: WriteRequest[] = productDtos.map((productDto) => {
			return {
				PutRequest : {
					Item: AWS.DynamoDB.Converter.marshall(productDto)
				}
			}
		})
		
		const str = ['{"', this.tableName(), '":', JSON.stringify(requests), "}"].join("")

		const param : BatchWriteItemInput = {
			RequestItems: JSON.parse(str)
		}

		const ddb = this.ddb()
		await ddb.batchWriteItem(param).promise()

		return productDtos
	}

	public async updateProducts(productDtos: Array<ProductDto>) {

		const requests: WriteRequest[] = productDtos.map((productDto) => {
			return {
				PutRequest : {
					Item: AWS.DynamoDB.Converter.marshall(productDto),
				}
			}
		})
		
		const str = ['{"', this.tableName(), '":', JSON.stringify(requests), "}"].join("")

		const param : BatchWriteItemInput = {
			RequestItems: JSON.parse(str)
		}

		const ddb = this.ddb()
		await ddb.batchWriteItem(param).promise()

		return productDtos
	}

	public async updateProductById(pid: string, product: Product) {

		const productDto: ProductDto = {
			...product, 
			id: pid
		}

		const ddb = this.ddb()
		const param : PutItemInput = {
			TableName: this.tableName(),
			Item: AWS.DynamoDB.Converter.marshall(productDto),
			ConditionExpression: "attribute_exists(id)"
		}
		
		await ddb.putItem(param).promise()
		return productDto
	}

	public async deleteProducts(pidList: Array<string>) {
		const requests : WriteRequest[] = pidList.map((pid) => {
			return {
				DeleteRequest : {
					Key: AWS.DynamoDB.Converter.marshall({id: pid})
				}
			}
		})
		
		const str = ['{"', this.tableName(), '":', JSON.stringify(requests), "}"].join("")

		const param : BatchWriteItemInput = {
			RequestItems: JSON.parse(str)
		}

		const ddb = this.ddb()
		await ddb.batchWriteItem(param).promise()
	}

	public async deleteProductById(pid: string) {

		const ddb = this.ddb()

		const param: DeleteItemInput = {
			TableName: this.tableName(),
			Key: AWS.DynamoDB.Converter.marshall({id: pid})
		}

		await ddb.deleteItem(param).promise()
	}
}
