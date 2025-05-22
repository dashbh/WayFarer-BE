import { ListRequestDto, ListResponse } from '../dtos/common/list.dto';

// Convert DTO to MongoDB query
export function buildMongoQuery(req: ListRequestDto) {
  const query: any = {};

  // Full-text search
  // if (req.search) {
  //   query['$text'] = { $search: req.search };
  // }

  // Regex Search
  if (req.search) {
    const regex = { $regex: req.search, $options: 'i' };
    query['$or'] = [
      { name: regex },
      { description: regex },
      { title: regex },
      { location: regex },
    ];
  }

  // Filters
  req.filters?.forEach((f) => {
    switch (f.operator) {
      case 'eq':
        query[f.field] = f.value;
        break;
      case 'ne':
        query[f.field] = { $ne: f.value };
        break;
      case 'gt':
        query[f.field] = { $gt: f.value };
        break;
      case 'lt':
        query[f.field] = { $lt: f.value };
        break;
      case 'gte':
        query[f.field] = { $gte: f.value };
        break;
      case 'lte':
        query[f.field] = { $lte: f.value };
        break;
      case 'in':
        query[f.field] = { $in: Array.isArray(f.value) ? f.value : [f.value] };
        break;
      default:
        throw new Error(`Unsupported operator: ${f.operator}`);
    }
  });

  // Sorting
  const sort: Record<string, 1 | -1> = {};
  req.sort?.forEach((s) => {
    sort[s.field] = s.order === 'asc' ? 1 : -1;
  });

  return {
    query,
    sort,
    skip: (req.page - 1) * req.limit,
    limit: req.limit,
  };
}

// Convert DTO to gRPC request
export function mapToGrpcRequest(query: any): ListRequestDto {
  const { page = 1, limit = 10, search = '', ...rest } = query;

  const filters: any[] = [];
  const sort: any[] = [];

  // Match patterns like filters[0][field], filters[0][value], filters[0][op]
  const filterRegex = /^filters\[(\d+)]\[(field|value|operator)]$/;
  const sortRegex = /^sort\[(\d+)]\[(field|order)]$/;

  const filterMap = new Map<number, any>();
  const sortMap = new Map<number, any>();

  for (const key in rest) {
    const fMatch = key.match(filterRegex);
    if (fMatch) {
      const index = parseInt(fMatch[1], 10);
      const prop = fMatch[2];
      if (!filterMap.has(index)) filterMap.set(index, {});
      filterMap.get(index)[prop === 'operator' ? 'operator' : prop] = rest[key];
    }

    const sMatch = key.match(sortRegex);
    if (sMatch) {
      const index = parseInt(sMatch[1], 10);
      const prop = sMatch[2];
      if (!sortMap.has(index)) sortMap.set(index, {});
      sortMap.get(index)[prop === 'order' ? 'order' : prop] = rest[key];
    }
  }

  filterMap.forEach((f) => filters.push(f));
  sortMap.forEach((s) => sort.push(s));

  return {
    page: Number(page),
    limit: Number(limit),
    search,
    filters,
    sort,
  };
}

// Convert gRPC response to standardized list response
export function mapToGrcpResponse<T>(response: any): ListResponse<T> {
  return {
    items: response.items || [],
    total: response.total || 0,
    page: response.page || 1,
    limit: response.limit || 10,
    search: response.search || '',
    filters: response.filters || [],
    sort: response.sort || [],
  };
}

// Convert gRPC response to standardized list response
export function mapGrpcResponseToHTTP<T>(response: any): ListResponse<T> {
  return {
    items: response.items || [],
    total: response.total || 0,
    page: response.page || 1,
    limit: response.limit || 10,
    search: response.search || '',
    filters: response.filters || [],
    sort: response.sort || [],
  };
}
