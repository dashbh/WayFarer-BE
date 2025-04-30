import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { KafkaService } from '@wayfarer/framework';

describe('HealthController', () => {
  let healthController: HealthController;
  let kafkaService: KafkaService;

  const kafkaServiceMock = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: KafkaService,
          useValue: kafkaServiceMock,
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return { status: "ok" } and publish a Kafka message', async () => {
    kafkaServiceMock.publish.mockResolvedValueOnce(undefined); // or a mock return if needed

    const result = await healthController.check();

    expect(result).toEqual({ status: 'ok' });
    expect(kafkaService.publish).toHaveBeenCalledWith('health', [
      { key: 'health', value: 'ok' },
    ]);
  });
});
