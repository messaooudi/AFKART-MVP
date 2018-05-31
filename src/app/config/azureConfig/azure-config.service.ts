import { Injectable } from '@angular/core';

@Injectable()
export class AzureConfigService {
  endPoint: String = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0';
  key1: String = '36a537fb404747ba9000c26afaf63ea5';
  key2: String = 'd0321b1a604642449a1a5ade53e926b4';
  constructor() { }

}
