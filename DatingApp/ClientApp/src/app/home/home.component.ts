import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{

  registerMode = false;
  public values: Values[];
  myAppUrl: string = "";

  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {    
    this.myAppUrl = baseUrl;
  }

  ngOnInit(){
    this.getValues();
  }
  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  getValues() {
    this.http.get<Values[]>(this.myAppUrl + "api/Values/").subscribe(
      (result) => {
        this.values = result;
      },
      (error) => console.error(error)
    );
  }
}

interface Values {
  id: number;
  name: string;
}
