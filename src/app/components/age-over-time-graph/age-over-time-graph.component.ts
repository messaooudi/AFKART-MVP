import { Component, OnInit } from '@angular/core';
import { DataService, Persone } from '../../services/data.service';

@Component({
  selector: 'age-over-time-graph',
  templateUrl: './age-over-time-graph.component.html',
  styleUrls: ['./age-over-time-graph.component.css']
})
export class AgeOverTimeGraphComponent implements OnInit {

  labels: Array<string> = new Array();
  chartData: Array<any> = new Array();
  chartOptions: any = {
    responsive: false
  }

  // CHART COLOR.
  colors = [
    {
      backgroundColor: 'rgba(30, 169, 224, 0.3)'
    },
    {
      backgroundColor: 'rgba(104, 33, 123, 0.6)'
    },
    {
      backgroundColor: 'rgba(221, 89, 0, 0.6)'
    }
  ]


  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.stream.subscribe(
      (persones: Array<Persone>) => {
        this.updateData(persones);
      }
    )
  }


  updateData(persones: Array<Persone>): void {
    let last = { val: null, count: 0 };
    let lastMale = { valMale: null, countMale: 0 };
    let lastFemale = { valFemale: null, countFemale: 0 };
    let data = [];
    persones.forEach(persone => {
      persone.emotions.forEach(({ time }) => {
        const current = {
          val: last.val + persone.age,
          valMale: persone.gender == 'male' ? lastMale.valMale + persone.age : null,
          valFemale: persone.gender == 'female' ? lastFemale.valFemale + persone.age : null,
          count: last.count + 1,
          countMale: persone.gender == 'male' ? lastMale.countMale + 1 : lastMale.countMale,
          countFemale: persone.gender == 'female' ? lastFemale.countFemale + 1 : lastFemale.countFemale,
          gender: persone.gender,
          time,
        }
        data.push(current);
        last = current;
        if (persone.gender == 'male') lastMale = current;
        if (persone.gender == 'female') lastFemale = current;
      })
    })
    Object.assign(this.labels, data.slice(Math.max(data.length - 10, 1)).map(v => (<Date>v.time).toLocaleTimeString()))
    this.chartData = [{
      label: 'Age moyen',
      fill: false,
      data: data.slice(Math.max(data.length - 10, 1)).map(c => c.val / c.count)
    },
    {
      label: 'Age moyen - homme',
      fill: false,
      data: data.slice(Math.max(data.length - 10, 1)).map(c => c.valMale ? c.valMale / c.countMale : null)

    },
    {
      label: 'Age moyen - femme',
      fill: false,
      data: data.slice(Math.max(data.length - 10, 1)).map(c => c.valFemale ? c.valFemale / c.countFemale : null)
    }
    ]
    //this.dataService.data.next({ ageOverTime: this.chartData[0].data[this.chartData[0].data.length-1] })
  }
}