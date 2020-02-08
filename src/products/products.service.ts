import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { GetItemInput, ScanInput, PutItemInput, DeleteItemInput } from 'aws-sdk/clients/dynamodb';
import { ProductDto } from './dtos/productDto';

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
		else {
			return AWS.DynamoDB.Converter.unmarshall(result.Item)
		}
	}

	public async writeProductById(pid: string, product: ProductDto) {

		product.id = pid

		const ddb = this.ddb()
		const param : PutItemInput = {
			TableName: this.tableName(),
			Item: AWS.DynamoDB.Converter.marshall(product),
			ConditionExpression: "attribute_exists(id)"
		}
		
		await ddb.putItem(param).promise()
		return product
	}

	public async deleteProductById(pid: string) {

		const ddb = this.ddb()

		const param: DeleteItemInput = {
			TableName: this.tableName(),
			Key: AWS.DynamoDB.Converter.marshall({id: pid})
		}

		ddb.deleteItem(param).promise()
	}
}
