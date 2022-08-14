import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from "../src/review/constants/review-error.constants";

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
	name: 'test',
	title: 'test',
	description: 'test',
	rating: 5,
	productId: productId
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	it('/review/get-by-productid/:productId (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/review/get-by-productid/' + productId)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
			})
	});

	it('/review/get-by-productid/:productId (GET) - fail', async () => {
		return request(app.getHttpServer())
			.get('/review/get-by-productid/' + new Types.ObjectId().toHexString())
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0);
			})
	});

	it('/review/:id (DELETE) - success', async () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.expect(200);
	});

	it('/review/:id (DELETE) - fail', async () => {
		return request(app.getHttpServer())
			.delete('/review/' + new Types.ObjectId().toHexString())
			.expect(404, {
				statusCode: 404,
				message: REVIEW_NOT_FOUND
			});
	});

  afterAll(() => {
    disconnect();
  });
});
