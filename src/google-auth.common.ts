import * as app from 'tns-core-modules/application';
import * as dialogs from 'tns-core-modules/ui/dialogs';

export class BooleanResult {
  public status: boolean;
  public error:any;

  constructor(status:boolean, error?:any) {
    this.status = status;
    if(error) {
      this.error = error;
    }
  }
}

export class LoginResult {
    idToken?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    error?: any;
    email?: string;
    photoUrl?: string;;
}


export abstract class GoogleAuthBase {
  abstract init(serverClientId:string, logincallback: any, logoutcallback: any):BooleanResult;
  abstract login():void;
  abstract logout():void;
}
