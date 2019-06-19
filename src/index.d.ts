import { GoogleAuthBase, BooleanResult } from './google-auth.common';
export declare class GoogleAuth extends GoogleAuthBase {
    init(serverClientId: string, logincallback: any, logoutcallback: any): BooleanResult;
    login(): void;
    logout(): BooleanResult;
}
