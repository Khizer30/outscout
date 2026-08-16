import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    if (request?.path === "/api/metrics" || request?.path === "/metrics") {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        if (typeof data !== "object" || data === null) {
          return data;
        }

        return {
          success: true,
          ...data
        };
      })
    );
  }
}
