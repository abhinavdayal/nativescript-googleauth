import { android as androidApp, AndroidApplication, AndroidActivityResultEventData } from "tns-core-modules/application"
import { GoogleAuthBase, LoginResult, BooleanResult } from './google-auth.common';

declare const com;

export class GoogleAuth extends GoogleAuthBase {
    readonly RC_SIGN_IN = 1;
    private serverClientId: string;
    private _googleSignInOptions: any;
    private _googleSignInClient: any;
    private _googleSignInAccount: any;
    private loginResult: LoginResult;
    private loginCallback: any;
    private logoutCallback: any;

    init(serverClientId: string, logincallback: any, logoutcallback: any): BooleanResult {
        this.serverClientId = serverClientId;
        this.loginCallback = logincallback;
        this.logoutCallback = logoutcallback;

        const onLoginResult = ({ requestCode, resultCode, intent }: AndroidActivityResultEventData) => {
            console.log("returned result", requestCode, resultCode);
            if (requestCode == this.RC_SIGN_IN && resultCode!=0) {
                const signInResult = com.google.android.gms.auth.api.signin.GoogleSignIn.getSignedInAccountFromIntent(intent);
                console.log("successful signin");
                try {
                    this._googleSignInAccount = signInResult.getResult(com.google.android.gms.common.api.ApiException.class);
                    //console.log(this._googleSignInAccount);
                    this.setLoginResult();
                    this.loginCallback(this.loginResult);
                } catch (e) {
                    console.log("signInResult:failed " + e);
                }
            } else {
                console.log("no result");
            }
        }

        androidApp.on(AndroidApplication.activityResultEvent, onLoginResult);

        return new BooleanResult(true);

    }


    login(): void {
        if (this.loginResult) {
            // user is already logged in
            console.log("Already Logged In");
            this.loginCallback(this.loginResult);
        } else {
            this._googleSignInOptions = new com.google.android.gms.auth.api.signin.GoogleSignInOptions.Builder(
                com.google.android.gms.auth.api.signin.GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(this.serverClientId)
                .requestEmail()
                .build();
            this._googleSignInAccount = com.google.android.gms.auth.api.signin.GoogleSignIn.getLastSignedInAccount(androidApp.foregroundActivity);
            if(!this._googleSignInAccount) {
                this._googleSignInClient = new com.google.android.gms.auth.api.signin.GoogleSignIn.getClient(
                    androidApp.foregroundActivity, this._googleSignInOptions);
                try {
                    const signInIntent = this._googleSignInClient.getSignInIntent();
                    androidApp.foregroundActivity.startActivityForResult(
                        signInIntent,
                        this.RC_SIGN_IN
                    );
                } catch (e) {
                    console.log(e);
                }
            } else {
                this.setLoginResult();
                this.loginCallback(this.loginResult);
            }
        }
    }
    private setLoginResult() {
        this.loginResult = new LoginResult();
        this.loginResult.idToken = this._googleSignInAccount.getIdToken();
        this.loginResult.email = this._googleSignInAccount.getEmail();
        this.loginResult.photoUrl = this._googleSignInAccount.getPhotoUrl();
        this.loginResult.displayName = this._googleSignInAccount.getDisplayName();
        this.loginResult.firstName = this._googleSignInAccount.getGivenName();
        this.loginResult.lastName = this._googleSignInAccount.getFamilyName();
    }

    logout() {
        if(!this._googleSignInClient) {
            this._googleSignInOptions = new com.google.android.gms.auth.api.signin.GoogleSignInOptions.Builder(
                com.google.android.gms.auth.api.signin.GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(this.serverClientId)
                .requestEmail()
                .build();
            this._googleSignInClient = new com.google.android.gms.auth.api.signin.GoogleSignIn.getClient(
                androidApp.foregroundActivity, this._googleSignInOptions);
        }
        let signOut = this._googleSignInClient.signOut();

        signOut.addOnCompleteListener(androidApp.foregroundActivity, 
            new com.google.android.gms.tasks.OnCompleteListener({
                onComplete: task => {
                    this.loginResult = null;
                    this.logoutCallback()
                }
            }));
    }
}
