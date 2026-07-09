import { AppError } from "@common/app.error";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof AppError) {
      return response.status(exception.statusCode).json({
        success: false,
        code: exception.code,
        message: exception.message,
        details: exception.details ?? null,
        path: request.url
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return response.status(status).json({
        success: false,
        code: "HTTP_EXCEPTION",
        message: typeof res === "string" ? res : ((res as Record<string, unknown>).message as string) || "HTTP Exception",
        details: null,
        path: request.url
      });
    }

    this.logger.error(exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      details: null,
      path: request.url
    });
  }
}
