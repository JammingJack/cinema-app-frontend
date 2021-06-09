import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {host} from "@angular-devkit/build-angular/src/test-utils";

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  public host : string = "http://localhost:8080"
  constructor(private http : HttpClient) { }

  public getVilles(){
    return this.http.get(this.host+"/villes");
  }

  getCinemas(v:any) {
    return this.http.get(v._links.cinemas.href);
  }

  getSalles(c:any) {
    return this.http.get(c._links.salles.href);
  }

  getProjections(salle:any) {
    let url=salle._links.projections.href.replace("{?projection}","");
    return this.http.get(url+"?projection=filmNeededInfoProjection");
  }

  getTicketsPlaces(p) {
    let url=p._links.tickets.href.replace("{?projection}","");
    return this.http.get(url+"?projection=ticketProj");
  }

  payerTickets(dataForm) {
    return this.http.post(this.host+"/payerTickets",dataForm);
  }
}
