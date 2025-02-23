import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { HttpResponse } from '@wayfarer/common';

describe('CatalogController', () => {
  let catalogController: CatalogController;
  let catalogServiceMock: CatalogService;

  beforeEach(async () => {
    catalogServiceMock = {
      getCatalogList: jest.fn(),
      getCatalogItem: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        { provide: CatalogService, useValue: catalogServiceMock },
      ],
    }).compile();

    catalogController = module.get<CatalogController>(CatalogController);
  });

  it('should be defined', () => {
    expect(catalogController).toBeDefined();
  });

  describe('getCatalogList', () => {
    it('should return a success response with catalog list', async () => {
      const mockCatalogList = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];

      (catalogServiceMock.getCatalogList as jest.Mock).mockReturnValue(mockCatalogList);

      const result = catalogController.getCatalogList();

      expect(catalogServiceMock.getCatalogList).toHaveBeenCalled();
      expect(result).toEqual(HttpResponse.success(mockCatalogList, 'Success'));
    });
  });

  describe('getCatalogItem', () => {
    it('should return a success response with a catalog item', async () => {
      const catalogId = '1';
      const mockCatalogItem = { id: '1', name: 'Item 1' };

      (catalogServiceMock.getCatalogItem as jest.Mock).mockReturnValue(mockCatalogItem);

      const result = catalogController.getCatalogItem({ id: catalogId });

      expect(catalogServiceMock.getCatalogItem).toHaveBeenCalledWith({ id: catalogId });
      expect(result).toEqual(HttpResponse.success(mockCatalogItem, 'Success'));
    });
  });
});
