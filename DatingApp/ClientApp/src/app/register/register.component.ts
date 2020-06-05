import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {  
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {}

  register() {
    this.authService.register(this.model).subscribe(() => {
      console.log('Registro exitoso');
    }, error => {
        console.log(error);
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log("ha sido cancelado");
  }
}
