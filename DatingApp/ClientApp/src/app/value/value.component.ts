import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
/** value component*/
export class ValueComponent implements OnInit {

  public values: Values[];
  myAppUrl: string = "";

  /** value ctor */
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  ngOnInit() {
    this.getValues();
  }

  getValues() {
    this.http.get<Values[]>(this.myAppUrl + 'api/Values/').subscribe(result => {
      this.values = result;
    }, error => console.error(error));
  }
}

interface Values {
  id: number,
  name: string;
}
