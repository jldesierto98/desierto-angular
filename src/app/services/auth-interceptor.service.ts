import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return from(this.handleAccess(request, next));
  }


  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    //only add the access token for the secured enpoint
    const theEndPont = environment.desiertoecommerceBackendUrl + '/order/orderHistory'
    const secureEnpoint = [theEndPont];

    if(secureEnpoint.some(url => request.url.includes(url))){

      const accessToken = this.oktaAuth.getAccessToken();

      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      })
    }

    return await lastValueFrom(next.handle(request));
    
  }
}
