import { Component, OnInit } from '@angular/core';
import { Persone, DataService } from '../../services/data.service';

@Component({
  selector: 'attendance-per-hour-graph',
  templateUrl: './attendance-per-hour-graph.component.html',
  styleUrls: ['./attendance-per-hour-graph.component.css']
})
export class AttendancePerHourGraphComponent implements OnInit {

  labels: Array<string> = new Array();
  chartData: Array<any> = new Array();
  chartOptions: any = {
    responsive: false
  }

  // CHART COLOR.
  colors = [
    {
      backgroundColor: 'rgba(30, 169, 224, 1)'
    },
    {
      backgroundColor: 'rgba(104, 33, 123, 1)'
    },
    {
      backgroundColor: 'rgba(221, 89, 0, 1)'
    }
  ]


  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.labels = ['< 8h', '8h-9h', '9h-10h', '10h-11h', '11h-12h', '12h-13h', '13h-14h', '14h-15h', '15h-16h', '16h-17h', '>17h']
    this.dataService.stream.subscribe(
      (persones: Array<Persone>) => {
        this.updateData(persones);
      }
    )
  }

  updateData(persones: Array<Persone>): void {

    let data = {}
    for (let i = 7; i <= 17; i++)
      data[i] = { male: null, female: null }

    persones.forEach(persone => {
      persone.emotions.forEach(({ time }) => {
        let hour = (<Date>time).getHours();
        if (hour < 8) hour = 7;
        else if (hour >= 17) hour = 17

        data[hour][persone.gender]++;
      })
    })


    this.chartData = [{
      label: 'Homme',
      fill: false,
      data: Object.values(data).map(val => (<any>val).male)
    },
    {
      label: 'Femme',
      fill: false,
      data: Object.values(data).map(val => (<any>val).female)
    },
    {
      label: 'Total',
      fill: false,
      data: Object.values(data).map(val => (<any>val).female+(<any>val).male)
    }
    ]
    //this.dataService.data.next({ attendancePerHour: data[(new Date()).getHours()] })

  }
}
