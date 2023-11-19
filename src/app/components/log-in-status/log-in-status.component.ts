import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-log-in-status',
  templateUrl: './log-in-status.component.html',
  styleUrls: ['./log-in-status.component.css']
})
export class LogInStatusComponent implements OnInit {
  
  isAuthenticated: boolean = false;
  userFullName: string = '';

  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {

      //subscribe to authentication state changes
      this.oktaAuthService.authState$.subscribe(
        (result) => {
          this.isAuthenticated = result.isAuthenticated!;

          this.getUserDetails();

        }
      )

  }


  getUserDetails() {

    if(this.isAuthenticated){

        //fetch the logged in user details (user's claims)
        //user full name is exposed as property name
        this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
         }
       );
    }
  }

  logout(){
    //Terminates the session with okta and remove current token.
    this.oktaAuth.signOut();
  }

}
