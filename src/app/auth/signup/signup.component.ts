import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  users = [
    {value: 'casual', viewValue: 'Casual'},
    {value: 'sfpc', viewValue: 'SFPC user'},
    {value: 'pilot', viewValue: 'Pilot'}
  ];

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }


  
  onSubmit(form:NgForm){
    console.log(form.value.usertype),
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
      displayName: form.value.name,
      userType: form.value.usertype,
    })
  }

}
