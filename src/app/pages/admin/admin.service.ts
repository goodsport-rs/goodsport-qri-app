import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable()
export class AdminService {
  url = environment.baseUrl;

  constructor() {}
}
