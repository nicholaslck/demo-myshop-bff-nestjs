import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

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

		const param = {
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

		const param = {
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




}
