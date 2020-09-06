import { Test, TestingModule } from '@nestjs/testing';
import { CustomerServersService } from './customer-servers.service';

describe('CustomerServersService', () => {
  let service: CustomerServersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerServersService],
    }).compile();

    service = module.get<CustomerServersService>(CustomerServersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
