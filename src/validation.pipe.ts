import { ValidationPipe, PipeTransform, ArgumentMetadata, Type, BadRequestException } from "@nestjs/common";

export class ArrayValidationPipe<T> extends ValidationPipe implements PipeTransform<any> {

	constructor(private readonly itemType: Type<T>) {
		super();
	}

	async transform(value: any, metadata: ArgumentMetadata) {
		if (!Array.isArray(value)) {
			throw new BadRequestException(["Object is not an array."].join(""))
		}
		else {
			return Promise.all(value.map(v => super.transform(v, { ...metadata, metatype: this.itemType})))
		}
	}
}

export class QueryArrayValidationPipe<T> implements PipeTransform<any> {

	constructor(private readonly itemType: Type<T>) {}

	async transform(value: any, metadata: ArgumentMetadata) {
	
		let json = null
		try {
			json = JSON.parse(value)
		}
		catch {
			throw new BadRequestException()
		}
		return new ArrayValidationPipe(this.itemType).transform(json, metadata)
	}
}
