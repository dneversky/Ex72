import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {User} from "../models/User";
import {Router} from "@angular/router";

@Component({
  selector: 'app-authorization',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public mainForm: FormGroup;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.mainForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.maxLength(64), Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.maxLength(32), Validators.required]),
    });
  }

  login() {
    if(this.mainForm.invalid)
      return

    const formData = new FormData();
    formData.append('username', this.mainForm.get('email').value);
    formData.append('password', this.mainForm.get('password').value);

    console.log("calling a service")

    this.authService.login(formData).subscribe(() => {
      console.log("trying navigate...");
      this.router.navigate(['/']);
    });
  }

}