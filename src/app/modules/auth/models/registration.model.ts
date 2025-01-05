import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class RegistrationModel extends AuthModel {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  organizationName: string;
  organizationNumber: string;
}
