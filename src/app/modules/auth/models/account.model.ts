import {AuthModel} from './auth.model';
import {AddressModel} from './address.model';
import {SocialNetworksModel} from './social-networks.model';

export class AccountModel extends AuthModel {
  id: number;
  username: string;
  externalId: string;
}

