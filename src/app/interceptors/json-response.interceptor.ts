import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class JsonResponseInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepting request:', request);  // Debug log

    return next.handle(request).pipe(
      switchMap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body instanceof Blob) {
            console.log('Intercepted Blob response:', event);  // Debug log
            return from(event.body.text()).pipe(
              switchMap(text => {
                try {
                  const json = JSON.parse(text);
                  // Construct a new HttpResponse with the parsed JSON body
                  const jsonResponse = new HttpResponse<any>({
                    body: json,
                    headers: event.headers,
                    status: event.status,
                    statusText: event.statusText,
                    url: event.url ?? undefined,
                  });
                  return of(jsonResponse);
                } catch (e) {
                  return throwError(() => new Error('Failed to parse JSON'));
                }
              })
            );
          }
          return of(event);
        }
        return of(event);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Blob) {
          console.log('Intercepted Blob error:', error);  // Debug log
          return from(error.error.text()).pipe(
            switchMap(text => {
              try {
                const errorJson = JSON.parse(text);
                // Construct a new HttpErrorResponse with the parsed JSON error
                const jsonErrorResponse = new HttpErrorResponse({
                  error: errorJson,
                  headers: error.headers,
                  status: error.status,
                  statusText: error.statusText,
                  url: error.url ?? undefined,
                });
                return throwError(() => jsonErrorResponse);
              } catch (e) {
                return throwError(() => error);
              }
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
