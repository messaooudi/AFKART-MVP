import { Injectable } from '@angular/core';
import { AzureApiService } from './azure-api/azure-api.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {
  persones: Array<Persone>;

  stream: BehaviorSubject<Array<Persone>>;
  data: BehaviorSubject<any> = new BehaviorSubject({});
  constructor(private azureApiService: AzureApiService) {
    this.persones = JSON.parse(localStorage.getItem('persones')) || new Array();
    this.persones.forEach(p => p.emotions.forEach(e => { e.time = new Date(e.time) }))
    this.stream = new BehaviorSubject(this.persones);
  }
  randomDate(start, end, startHour, endHour) {
    var date = new Date(+start + Math.random() * (end - start));
    var hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return date;
  }
  addPersone(persone: Persone) {
    const faceIds = this.getFaceIds();
    if (faceIds.length == -33) {
      this.azureApiService.findSimilar(persone.faceId, faceIds).subscribe(
        (data: Array<{ faceId, confidence }>) => {
          if (data.length > 0) {
            for (const result of data) {
              if (result.confidence > 0.5) {
                let matchedPersone = this.persones.find(persone => persone.faceId == result.faceId);
                if (matchedPersone) {
                  matchedPersone.emotions.push(persone.emotions[0]);
                  return;
                }
              }
            }
          }
          this.persones.push(persone);
          this.stream.next(this.persones);
          localStorage.clear()
          localStorage.setItem('persones', JSON.stringify(this.persones))
        },
        error => console.log(JSON.stringify(error))
      )
    } else {
      this.persones.push(persone);
      this.stream.next(this.persones);
      localStorage.clear()
      localStorage.setItem('persones', JSON.stringify(this.persones))
    }
  }

  getFaceIds(): Array<string> {
    return this.persones.map(persone => persone.faceId);
  }
}

export class Persone {
  faceId: string;
  gender: string;
  age: number;
  emotions: Array<Emotion> = new Array<Emotion>();
  constructor({ faceId, faceAttributes: { gender, age, emotion } }, image: Blob) {
    this.faceId = faceId;
    this.gender = gender;
    this.age = age;
    this.emotions.push(new Emotion(emotion, image))
  }
}

export class Emotion {
  time: Date;
  anger: number;
  contempt: number;
  disgust: number;
  fear: number;
  happiness: number;
  neutral: number;
  sadness: number;
  surprise: number;
  image: Blob;
  constructor({ anger, contempt, disgust, fear, happiness, neutral, sadness, surprise }, image: Blob) {
    this.time = new Date();
    this.anger = anger;
    this.contempt = contempt;
    this.disgust = disgust;
    this.fear = fear;
    this.happiness = happiness;
    this.neutral = neutral;
    this.sadness = sadness;
    this.surprise = surprise;
    this.image = image;
  }

}
