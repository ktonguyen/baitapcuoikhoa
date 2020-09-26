import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  data: any;
  products: any[];
  // display column covid
  columnDisplay =['country', 'cases', 'todayCases', 'deaths', 'recovered', 'todayRecovered','countryInfo']
  dataSource:any;
  length: any;
  pageIndex: any;
  
  @ViewChild (MatPaginator, { static: true }) paginator :MatPaginator;
  ngAfterViewInit() {
    this.covid19.covid19Rp().subscribe(data => {
      // Use MatTableDataSource for paginator
      this.dataSource = new MatTableDataSource(data);
      // Assign the paginator *after* dataSource is set
      this.dataSource.paginator = this.paginator;
    });
    //this.dataSource.paginator = this.paginator;
  }
  //end display

  constructor(private covid19: ApiService) { 
    //start
    this.covid19.covid19Rp().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    //end covid
  }

  ngOnInit() {
     //this.dataSource.paginator = this.paginator;
     this.covid19.covid19Rp().subscribe(data => {
      // Use MatTableDataSource for paginator
      this.dataSource = new MatTableDataSource(data);
      // Assign the paginator *after* dataSource is set
      this.dataSource.paginator = this.paginator;
    });
  }

  dispose(){
    this.subscriptions.forEach(subscription =>subscription.unsubscribe())
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  ngOnDestroy(): void {
    //this.subscriptions.unsubscribe();
  }

}
