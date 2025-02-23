import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/auth.guard';
import { of } from 'rxjs';

describe('CatalogController', () => {
  let catalogController: CatalogController;
  let catalogClientMock: ClientProxy;

  beforeEach(async () => {
    catalogClientMock = {
      send: jest.fn(() => of({ success: true })), // Mock send method
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        {
          provide: 'CATALOG_SERVICE',
          useValue: catalogClientMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Bypass JWT guard for unit testing
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    catalogController = module.get<CatalogController>(CatalogController);
  });

  it('should be defined', () => {
    expect(catalogController).toBeDefined();
  });

  it('should call catalogClient.send() on getCatalog', async () => {
    const data = { category: 'electronics' };
    await catalogController.getCatalog(data);

    expect(catalogClientMock.send).toHaveBeenCalledWith({ cmd: 'catalog' }, data);
  });

  it('should call catalogClient.send() on getCatalogList', async () => {
    await catalogController.getCatalogList();

    expect(catalogClientMock.send).toHaveBeenCalledWith({ cmd: 'get_catalog_list' }, {});
  });

  it('should call catalogClient.send() on getCatalogItem', async () => {
    const catalogId = '123';
    await catalogController.getCatalogItem(catalogId);

    expect(catalogClientMock.send).toHaveBeenCalledWith({ cmd: 'get_catalog_item' }, { id: catalogId });
  });
});
