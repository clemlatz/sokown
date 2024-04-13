import { HttpException, HttpStatus } from '@nestjs/common';

export class JsonApiError extends HttpException {
  constructor(status: HttpStatus, title: string, detail?: string) {
    super(
      {
        errors: [{ status, title, detail }],
      },
      status,
    );
    this.message = title;
  }
}
