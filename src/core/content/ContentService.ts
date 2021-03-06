import { injectable, inject } from 'inversify';

import { AsyncStorageService } from '@covid/core/AsyncStorageService';
import { AreaStatsResponse } from '@covid/core/user/dto/UserAPIContracts';
import { handleServiceError } from '@covid/core/api/ApiServiceErrors';
import UserService, { isSECountry, isUSCountry } from '@covid/core/user/UserService';
import i18n from '@covid/locale/i18n';
import { AppScreenContent, ScreenContent } from '@covid/core/content/ScreenContentContracts';
import { Services } from '@covid/provider/services.types';

import { IContentApiClient } from './ContentApiClient';

export interface IContentService {
  getUserCount(): Promise<string | null>;
  getWelcomeRepeatContent(): Promise<ScreenContent>;
  getAskedToRateStatus(): Promise<string | null>;
  setAskedToRateStatus(status: string): void;
  getUserCount(): Promise<string | null>;
  getStartupInfo(): void;
  getAreaStats(patientId: string): Promise<AreaStatsResponse>;
}

@injectable()
export default class ContentService implements IContentService {
  private screenContent: AppScreenContent;

  constructor(@inject(Services.ContentApi) private apiClient: IContentApiClient) {}

  static getWebsiteUrl = () => {
    if (isUSCountry()) {
      return 'https://covid.joinzoe.com/us';
    } else if (isSECountry()) {
      return 'https://covid19app.lu.se/';
    } else {
      return 'https://covid.joinzoe.com/';
    }
  };

  async getWelcomeRepeatContent() {
    if (!this.screenContent) {
      this.screenContent = await this.apiClient.getScreenContent(UserService.userCountry, UserService.getLocale());
    }
    return this.screenContent.WelcomeRepeat;
  }

  getCalloutBoxDefault(): ScreenContent {
    return {
      title_text: i18n.t('welcome.research'),
      body_text: i18n.t('welcome.see-how-your-area-is-affected'),
      body_link: ContentService.getWebsiteUrl(),
      link_text: i18n.t('welcome.visit-the-website'),
      body_photo: null,
      experiment_name: '',
      cohort_id: 0,
      analytics: '',
    };
  }

  async getUserCount() {
    return await AsyncStorageService.getUserCount();
  }

  async getStartupInfo() {
    try {
      const info = await this.apiClient.getStartupInfo();
      UserService.ipCountry = info.ip_country;
      await AsyncStorageService.setUserCount(info.users_count.toString());
    } catch (error) {
      handleServiceError(error);
    }
  }

  public async getAskedToRateStatus() {
    return AsyncStorageService.getAskedToRateStatus();
  }

  public setAskedToRateStatus(status: string) {
    AsyncStorageService.setAskedToRateStatus(status);
  }

  public async getAreaStats(patientId: string) {
    return this.apiClient.getAreaStats(patientId);
  }
}
