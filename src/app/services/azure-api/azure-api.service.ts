import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AzureApiService {
  private counter = 0;

  private azureKeys: Array<{ key1: string, key2: string, counter: number, id: string }> = new Array();
  private endpoint = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0';

  constructor(public http: HttpClient) {
    this.azureKeys.push({
      id: 'rim',
      key1: 'c0a14b8b38154153b63d8e70e864ed81',
      key2: 'fb34198b8e2846d9b3797f7b817d6822',
      counter: 0
    })
    this.azureKeys.push({
      id: 'adel',
      key1: '64797440de664a41b1a98ab4fa4d6755',
      key2: 'b8e23ce769ce48d5b7ef82ac40341a1b',
      counter: 0
    })
    this.azureKeys.push({
      id: 'kotb',
      key1: '36122b11b9514a8084dce1cc57a24f2e',
      key2: '60c07e7dd6d54407976032b9ec65a511',
      counter: 0
    })
  }

  analyseFace(image: any) {
    //this.azureKeys[this.counter].counter++;
    console.log("|-> analyseFace  - key " + this.counter)//+"  -> " + this.azureKeys[this.counter].counter);
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': this.azureKeys[0].key1
    })
    this.counter++// = (this.counter + 1) % this.azureKeys.length
    return this.http.post(`${this.endpoint}/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,emotion`,
      image,
      { headers: headers }
    );
  }

  findSimilar(faceId: string = '', faceIds: string[] = []) {
    //this.azureKeys[1].counter++;
    console.log("    |-> findSimilar  - key " + this.counter+" | "+faceId+" "+faceIds.length)//+"  -> " + this.azureKeys[this.counter].counter);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': this.azureKeys[0].key1
    })
    this.counter++;
    return this.http.post(`${this.endpoint}/findsimilars`,
      {
        'faceId':faceId,
        'faceIds': [...faceIds],
        //'faceListId': null,
        //'largeFaceListId': null
      },
      { headers }
    )
  }
}

