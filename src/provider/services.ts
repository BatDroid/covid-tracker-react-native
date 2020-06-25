import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

import { ConsentService, IConsentService } from '@covid/core/consent/ConsentService';
import ApiClient, { IApiClient } from '@covid/core/api/ApiClient';
import { IContentApiClient, ContentApiClient } from '@covid/core/content/ContentApiClient';
import ContentService, { IContentService } from '@covid/core/content/ContentService';
import UserService, { IUserService } from '@covid/core/user/UserService';
import { LocalisationService, ILocalisationService } from '@covid/core/localisation/LocalisationService';
import { IPatientService, PatientService } from '@covid/core/patient/PatientService';
import { IProfileService, ProfileService } from '@covid/core/profile/ProfileService';

import { Services } from './services.types';

export const container = new Container();

container.bind<IApiClient>(Services.Api).to(ApiClient).inSingletonScope();

container.bind<IUserService>(Services.User).to(UserService).inSingletonScope();

container.bind<IContentApiClient>(Services.ContentApi).to(ContentApiClient).inSingletonScope();

container.bind<IContentService>(Services.Content).to(ContentService).inSingletonScope();

container.bind<IConsentService>(Services.Consent).to(ConsentService).inSingletonScope();

container.bind<ILocalisationService>(Services.Localisation).to(LocalisationService).inSingletonScope();

container.bind<IPatientService>(Services.Patient).to(PatientService).inSingletonScope();

container.bind<IProfileService>(Services.Profile).to(ProfileService).inSingletonScope();

export const { lazyInject } = getDecorators(container);
