import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  wishesData: any = [];
  lastRandomNumber: number = 0;
  showVideo: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.getWishes();
  }

  getRandomImage() {
    let randonNumber = Math.trunc(Math.random() * 19 + 1);
    while (randonNumber === this.lastRandomNumber) {
      randonNumber = Math.trunc(Math.random() * 19 + 1);
      if (randonNumber !== this.lastRandomNumber) break;
    }
    this.lastRandomNumber = randonNumber;

    return `../assets/sharon${randonNumber}.jpg`;
  }

  onShowVideoClick() {
    this.showVideo = true;
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
  }

  getWishes() {
    let sheetID = '1jtlk0aCqAOBLYdhfW1JtDgrrOfGXxTltrK4iAfFw4ZI';
    let baseURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
    let sheetName = 'wishes';
    let query = encodeURIComponent('Select *');
    let URL = `${baseURL}sheet=${sheetName}&tq=${query}`;

    fetch(URL)
      .then((res) => res.text())
      .then((rep) => {
        let data = JSON.parse(rep.substring(47).slice(0, -2));
        for (let i of data.table.rows) {
          this.wishesData.push({
            wisherName: i.c[1].v,
            wish: i.c[2].v,
            imageURL: this.getRandomImage(),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
