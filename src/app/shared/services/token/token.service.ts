import { Injectable } from '@angular/core';
import { TokenData } from '../../models/token-data.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenData: TokenData | null = null;

  getAccessToken() {
    return this.tokenData?.accessToken;
  }

  clearTokenData() {
    this.tokenData = null;
    localStorage.clear();
  }

  setTokenData(newData: { accessToken: string; accessTokenExpiresIn: number }) {
    const TIME_UNTIL_VALIDATION_IN_MINUTES = 3;
    const now = Date.now();

    const accessTokenEndValidity =
      now +
      newData.accessTokenExpiresIn -
      TIME_UNTIL_VALIDATION_IN_MINUTES * 60000;

    this.tokenData = {
      accessToken: newData.accessToken,
      accessTokenEndValidity,
    };
  }

  areTokensValidity() {
    if (!this.tokenData) {
      return false;
    }
    const now = Date.now();
    const isAccessTokenValid =
      (this.tokenData.accessTokenEndValidity || 0) > now;
    return isAccessTokenValid;
  }
}
