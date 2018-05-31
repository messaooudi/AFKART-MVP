import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DataService, Persone } from '../../services/data.service';

@Component({
  selector: 'emotions-graph',
  templateUrl: './emotions-graph.component.html',
  styleUrls: ['./emotions-graph.component.css']
})
export class EmotionsGraphComponent implements OnInit {
  minutes : number = 5;

  labels: Array<string> = ['Happiness', 'Neutral', 'Anger'];
  chartData: Array<ChartData> = new Array();
  chartOptions: any = {
    responsive: false
  }

  // CHART COLOR.
  colors = [{ backgroundColor: ["#45f442", "#a1cec0", "#f72d09"] }]
  constructor(
    private dataService: DataService,
  ) {
  }

  ngOnInit() {
    this.dataService.stream.subscribe(
      (persones: Array<Persone>) => {
        this.updateData(persones);
      }
    )
  }
  updateData(persones: Array<Persone>): void {
    let data = { 'happiness': 0, 'neutral': 0, 'anger': 0 }
    let counter = 0// { 'happy': 0, 'sad': 0, 'angry': 0 }
    persones.forEach(persone => {
      persone.emotions.filter(emotion => Math.floor((Math.abs(emotion.time.getTime() - (new Date()).getTime()) / 1000) / 60) < this.minutes).forEach(emotion => {
        data['happiness'] += emotion.happiness;
        data['neutral'] += emotion.neutral;
        data['anger'] += emotion.anger;
        counter++;
      })
    })
    this.chartData = [{
      label: 'Emotion',
      data: [data.happiness, data.neutral, data.anger]
    }]

    if (data['anger'] >= data['happiness'] + data['neutral']) {

    }
  }

}


interface ChartData {
  label: string
  data: Array<number>
}