import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from "../src/auth/dto/auth.dto";
import { log } from "util";

const loginDto: AuthDto = {
  login: 'gordeyst@gmail.com',
  password: '1234'
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

  });

  it('/auth/signin (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      })
  });

  it('/auth/signin (POST) - fail password', async () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ ...loginDto, password: '1' })
      .expect(401, {
        statusCode: 401,
        message: "The password is wrong",
        error: "Unauthorized"
      });
  });

  it('/auth/signin (POST) - fail login', async () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ ...loginDto, login: "a@mail.ru" })
      .expect(401, {
        statusCode: 401,
        message: "The user with the following email not found",
        error: "Unauthorized"
      });
  });

  afterAll(() => {
    disconnect();
  });
});
