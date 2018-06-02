import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageFactoryService } from './services/image-factory.service';
import { AzureApiService } from './services/azure-api/azure-api.service';
import { DataService, Persone } from './services/data.service';
import { FacestoreService } from './services/face-store.service';
import { PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private analyseRate = 3100;
  private findSimilarRate = 1000;
  constructor(
    private imageFactoryService: ImageFactoryService,
    private azureApiService: AzureApiService,
    private dataService: DataService,
    private FaceStoreService: FacestoreService) { }

  ngOnInit(): void {
    this.imageFactoryService.startVideoStream();
    //setInterval(() => {
    //}, this.analyseRate);
    setTimeout(() => { this.query() }, 2000)
  }

  query() {
    this.imageFactoryService.getCanvas().toBlob((blob) => {
      this.azureApiService.analyseFace(blob).subscribe(
        (data: Array<any>) => {
          if (data.length) {
            data.forEach((persone, i) => {
              setTimeout(() => {
                console.log(data.length)
                const p = new Persone(persone, blob);
                if (this.calculateArea(persone) >= 0.3 && this.FaceStoreService.faceIds.length == 0) {
                  this.registerNewFace(p);
                }
                if (data.length === 1 && this.FaceStoreService.faceIds.length > 0) {
                  this.azureApiService.findSimilar(p.faceId, this.FaceStoreService.faceIds).subscribe(
                    (data: { faceId: string, confidence: number }[]) => {
                      let match = null;
                      data.forEach(element => {
                        if (match == null || match.confidence < element.confidence)
                          match = element;
                      })
                      if (match != null) {
                        let knownFaceInfo = this.FaceStoreService.knownFaces.find(knownFace => knownFace.faceId == match.faceId);
                        if (knownFaceInfo) {
                          p.nom = knownFaceInfo.nom;
                          p.prenom = knownFaceInfo.prenom;
                        }
                        alert('Re-Bonjour ' + p.nom + " " + p.prenom)
                      } else {
                        console.log(match);
                        this.registerNewFace(p);
                      }
                      this.dataService.addPersone(p);

                      if (!data || data.length == 0 || data.length === i + 1) {
                        console.log('from inner')
                        setTimeout(() => { this.query() }, this.findSimilarRate);
                      }
                    },
                    ({ error: { message } }) => {
                      console.log(message)
                      setTimeout(() => { this.query() }, 2 * this.findSimilarRate);
                    }
                  )
                } else {
                  //this.FaceStoreService.addKonwnFace(p.faceId, '', '')
                  this.dataService.addPersone(p);
                  if (data.length === i + 1) {
                    console.log('from outer')
                    setTimeout(() => { this.query() }, 2 * this.findSimilarRate);
                  }
                }
              }, this.findSimilarRate * (i + 1))
              // this.dataService.addPersone(new Persone(persone, blob))
            })
          } else {
            console.log('from global')
            setTimeout(() => { this.query() }, 2 * this.findSimilarRate);
          }

        },
        ({ error: { message } }) => {
          console.log(JSON.stringify(message))
          setTimeout(() => { this.query() }, 2 * this.findSimilarRate);
        }
      );
    }, 'image/jpeg', 1);
  }

  calculateArea(persone) {
    console.log(persone.faceRectangle)
    return (1.9 * (persone.faceRectangle.width * persone.faceRectangle.height)) / (this.imageFactoryService.width * this.imageFactoryService.height)
  }

  registerNewFace(persone) {
    const fullName = prompt('Enter your full name ') || ''
    if (fullName) {
      const data = fullName.trim().split(/\s+/);
      persone.nom = data[0];
      persone.prenom = data[1];
      this.FaceStoreService.addKonwnFace(persone.faceId, persone.nom, persone.prenom);
    }
  }
}
