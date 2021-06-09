import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes :any;
  public cinemas :any;
  public currentVille:any;
  public currentCinema:any;
  public salles;
  public currentProjection: any;
  public selectedTicket: any;

  constructor(public cinemaService:CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data=>{
        this.villes = data;
      },err=>{
        console.log(err);
      })
  }

  onGetCinemas(v:any) {
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data=>{
        this.cinemas=data;
      },err=>{
        console.log(err);
        });
  }

  onGetSalles(c:any) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data=>{
        this.salles=data;
        this.salles._embedded.salles.forEach(salle=>{
          this.cinemaService.getProjections(salle)
            .subscribe(data=>{
              salle.projections=data;
            },err=>{
              console.log(err);
            });
        });
      },err=>{
        console.log(err);
        });
  }
  onGetTicketPlace(p){
    this.currentProjection=p;
    console.log(p);
    this.cinemaService.getTicketsPlaces(p).subscribe(data=>{
      this.currentProjection.tickets=data;
      this.selectedTicket=[];
    },err=>{
      console.log(err);
    })
  }

  onSelectTicket(t) {
    if(!t.selected){
      t.selected=true;
      this.selectedTicket.push(t)
    }else{
      t.selected=false;
      this.selectedTicket.splice(this.selectedTicket.indexOf(t),1)
    }
    console.log(this.selectedTicket)
  }

  getTicketClass(t) {
    let str="btn ticket ";
    if(t.reserve==true){
      str+="btn-danger disabled"
    }else if(t.selected==true){
      str+="btn-warning"
    }else{
      str+="btn-success"
    }
    return str;
  }

  onPayTickets(dataForm) {
    let tickets=[] as any;
    this.selectedTicket.forEach(t=>{
      tickets.push(t.id);
    });
    dataForm.tickets=tickets;
    this.cinemaService.payerTickets(dataForm)
      .subscribe(data=>{
        alert('payement effectué');
        this.onGetTicketPlace(this.currentProjection);
      },err=>{
        console.log(err);
        alert('error');
      });
  }

}
