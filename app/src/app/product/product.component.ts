import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from '../api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

interface DialogData {
  productName: string;
  price: string;
  amount: string;
  supplier: string;
  category: any;
}

interface ProductData {
  id: string;
  productName: string;
  price: string;
  amount: string;
  supplier: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit  {

  displayedColumns = ['select', 'id', 'productName', 'amount', 'price', 'supplier', 'categoryName'];
  dataSource: any;
  user: any;
  selection: SelectionModel<ProductData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private apiService: ApiService, public dialog: MatDialog, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.selection = new SelectionModel<ProductData>(true, []);
    this.user = JSON.parse(localStorage.getItem('userLogin'));
    console.log("this.user ", this.user );
  }

  ngAfterViewInit() {
    const self = this;
    
    this.apiService.get('api/Product/list-by-user?PageNumber=1&PageSize=10&Keyword=',{},
     { 'Authorization': 'Bearer ' + this.user.object.accessToken}).subscribe(
       (data: any) => {
        console.log(data)
        self.dataSource.data = data.object.items; 
       }
     )
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  dialogOpenWithData (category) {
    const self = this;
    const dialogRef = this.dialog.open(AddProductDialog, {
      width: '400px', /*fix chieu ngang cua dialog */
      data: {productName: null,
        price: null,
        amount: null,
        supplier: null,
        category: category
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed', result);
      this.apiService.post('api/Product/add', 
        {
          ...result
        },
        { 'Authorization': 'Bearer ' + this.user.object.accessToken}
      ).subscribe(
        (data: any) => {
          self._snackBar.open('Tạo mới thành công', '', {
            duration: 1000,
          });
          self.dataSource.data.push({
            ProductName: result.productName,
            Price: result.price,
            Amount: result.amount,
            Supplier: result.supplier,
            Id: data.object.data,
            CategoryName: result.category[0].categoryName
          })
          self.dataSource._updateChangeSubscription();
        },
        error => {
          self._snackBar.open('Tạo mới thất bại', '', {
            duration: 1000,
          });
        }
      )
      
    });
  }

  openDialog(): void {
    const self  = this;
    this.apiService.get('api/Category/list-by-user', 
      {
      },
      { 'Authorization': 'Bearer ' + this.user.object.accessToken}
    ).subscribe((data: any) => {
      self.dialogOpenWithData(data.object.items)
    })
  }

}

@Component({
  selector: 'add-product',
  templateUrl: './add.product.component.html',
})
export class AddProductDialog {

  constructor(
    public dialogRef: MatDialogRef<AddProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
