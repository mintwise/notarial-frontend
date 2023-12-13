import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {


  public sessionName = localStorage.getItem('nombre');
  public sessionEmail = localStorage.getItem('correo');
  public sessionRol = localStorage.getItem('rol');
  logOut(){
    localStorage.setItem('nombre','');
    localStorage.setItem('correo','');
    localStorage.setItem('rol','');
  }
  
}
