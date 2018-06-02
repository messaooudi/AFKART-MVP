import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AzureApiService } from './services/azure-api/azure-api.service';
import { ImageFactoryService } from './services/image-factory.service';
import { DataService } from './services/data.service';
import { AgeOverTimeGraphComponent } from './components/age-over-time-graph/age-over-time-graph.component';
import { ChartsModule } from 'ng2-charts';
import { EmotionsGraphComponent } from './components/emotions-graph/emotions-graph.component';
import { AttendancePerHourGraphComponent } from './components/attendance-per-hour-graph/attendance-per-hour-graph.component';
import { PubComponent } from './components/pub/pub.component'
import { FacestoreService } from './services/face-store.service';


@NgModule({
  declarations: [
    AppComponent,
    AgeOverTimeGraphComponent,
    EmotionsGraphComponent,
    AttendancePerHourGraphComponent,
    PubComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
  ],
  providers: [AzureApiService, ImageFactoryService, DataService,FacestoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
