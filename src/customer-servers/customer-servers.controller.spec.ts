import { Test, TestingModule } from '@nestjs/testing';
import { CustomerServersController } from './customer-servers.controller';

describe('CustomerServersController', () => {
  let controller: CustomerServersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerServersController],
    }).compile();

    controller = module.get<CustomerServersController>(CustomerServersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
