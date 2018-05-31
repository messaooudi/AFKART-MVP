import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageFactoryService } from './services/image-factory.service';
import { AzureApiService } from './services/azure-api/azure-api.service';
import { DataService, Persone } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private analyseRate = 3100;
  private findSimilarRate = 1500;
  constructor(private imageFactoryService: ImageFactoryService, private azureApiService: AzureApiService, private dataService: DataService) { }

  ngOnInit(): void {
    this.imageFactoryService.startVideoStream();
    setInterval(() => {
      this.imageFactoryService.getCanvas().toBlob((blob) => {
        this.azureApiService.analyseFace(blob).subscribe(
          (data: Array<any>) => {
            if (data.length) {
              data.forEach((persone, i) => {
                // setTimeout(this.dataService.addPersone(new Persone(persone, blob))
                //   , this.findSimilarRate * i + 1)
                this.dataService.addPersone(new Persone(persone, blob))
              })
            }
          },
          error => console.log(JSON.stringify(error))
        );
      }, 'image/jpeg', 1);
    }, this.analyseRate);
  }
}
