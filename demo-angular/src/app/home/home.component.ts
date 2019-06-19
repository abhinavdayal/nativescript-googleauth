import { Component, OnInit } from "@angular/core";
import { GoogleAuth } from "nativescript-google-auth"

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    displayname: string;
    email: string;
    private googleAuth:GoogleAuth;
    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this.googleAuth = new GoogleAuth();
        // change your auth key below
        this.googleAuth.init('999450461765-jq9dd9i7evlqunrhe7ishhajfdu9rq0t.apps.googleusercontent.com', 
        (loginresult)=>{
            console.log(loginresult);
            this.displayname = loginresult.displayName;
            this.email = loginresult.email;
        },
        ()=>{
            console.log("logged out successfully");
            this.displayname = "";
            this.email = "";
        });
    }

    login() {
        this.googleAuth.login();

    }

    logout() {
        this.googleAuth.logout();

    }
}
