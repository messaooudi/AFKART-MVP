import { Component, OnInit } from '@angular/core';
import { DataService, Persone } from '../../services/data.service';

@Component({
  selector: 'pub',
  templateUrl: './pub.component.html',
  styleUrls: ['./pub.component.css']
})
export class PubComponent implements OnInit {
  time = 5;
  img: string = 'code18.jpg'
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.stream.subscribe(persones => {
      let counter = 0;
      let ageMoyen = 0;
      let attendancePerHour = { male: 0, female: 0 };
      let attendance = { male: 0, female: 0 };
      persones.forEach(persone => {
        persone.emotions.filter(emotion => Math.floor((Math.abs(emotion.time.getTime() - (new Date()).getTime()) / 1000)) < this.time).forEach(
          emotion => {
            counter++;
            ageMoyen += persone.age
            attendance[persone.gender]++;
          }
        )
      })
      ageMoyen /= counter;

      if (attendance.female <= attendance.male) {
        if (ageMoyen < 20) {
          this.img = 'code18.jpg'
        }
        if (ageMoyen < 30 && ageMoyen >= 20) {
          this.img = 'code30.jpg'
        }
        if (ageMoyen >= 30) {
          this.img = 'avenir.jpg'
        }
      } else {
        this.img = 'sayidati.jpg'
      }
    })
    // this.dataService.data.subscribe(({ ageOverTime, attendancePerHour }) => {
    //   this.attendancePerHour = attendancePerHour || this.attendancePerHour;
    //   if (this.attendancePerHour.female <= this.attendancePerHour.male) {
    //     if (ageOverTime < 20) {
    //       this.img = 'code18.jpg'
    //     }
    //     if (ageOverTime < 30) {
    //       this.img = 'code30.jpg'
    //     } else if (ageOverTime >= 30 && ageOverTime < 50) {
    //       this.img = 'avenir.jpg'
    //     } else {

    //     }
    //   } else {
    //     this.img = 'sayidati.jpg'
    //   }
    // })
  }

}
