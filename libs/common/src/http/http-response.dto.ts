export class HttpResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;

  constructor(statusCode: number, message: string, data?: T, error?: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success<T>(data: T, message = 'Success', statusCode = 200): HttpResponse<T> {
    return new HttpResponse<T>(statusCode, message, data);
  }

  static error(message = 'Something went wrong', error?: string, statusCode = 500): HttpResponse<null> {
    return new HttpResponse<null>(statusCode, message, undefined, error);
  }
}
