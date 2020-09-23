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

  displayedColumns = ['id', 'productName', 'amount', 'price', 'supplier', 'actionsColumn'];
  dataSource: any;
  user: any;
  products: any[];
  selection: SelectionModel<ProductData>;
  length: any;
  pageIndex: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private apiService: ApiService, public dialog: MatDialog, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>();
    this.selection = new SelectionModel<ProductData>(true, []);
    this.user = JSON.parse(localStorage.getItem('userLogin'));
    this.length = 0;
    this.pageIndex = 0;
    console.log("this.user ", this.user );
  }

  ngAfterViewInit() {
    const self = this;
    
    this.apiService.get('api/Product/list-by-user?PageNumber=1&PageSize=10&Keyword=',{},
     { 'Authorization': 'Bearer ' + this.user.object.accessToken}).subscribe(
       (data: any) => {
        console.log(data)
        self.products = data.object.items;
        self.products.length = data.object.total;
        self.dataSource = new MatTableDataSource<any>(self.products);
        self.dataSource.paginator = self.paginator;
        self.dataSource.sort = this.sort;
       }
     )
    
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.refreshGrid();
  }

  dialogOpenWithData (dataRow) {
    const self = this;
    const dialogRef = this.dialog.open(AddProductDialog, {
      width: '250px',
      data: dataRow});

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed', result);
      let categoryName = '';
      if(result.category.length > 0) {
        result.category.forEach(function(cat) {
          if(cat.id == result.CategoryId) {
            categoryName = cat.categoryName
          }
        })
      }
      delete result.category;
      if(result.edit) {
        delete result.edit;
        this.apiService.put('api/Product/edit', 
          {
            ...result
          },
          { 'Authorization': 'Bearer ' + this.user.object.accessToken}
        ).subscribe(
          (data: any) => {
            self._snackBar.open('Cập nhật thành công', '', {
              duration: 1000,
            });
            self.refreshGrid()
          },
          error => {
            self._snackBar.open('Cập nhật thất bại', '', {
              duration: 1000,
            });
          }
        )
      } else {
        delete result.edit;
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
              ProductName: result.ProductName,
              Price: result.ProductName,
              Amount: result.Amount,
              Supplier: result.Supplier,
              Id: data.object.data,
              CategoryName: categoryName
            })
            self.dataSource._updateChangeSubscription();
          },
          error => {
            self._snackBar.open('Tạo mới thất bại', '', {
              duration: 1000,
            });
          }
        )
      }
      return false;
      
      
    });
  }
  refreshGrid() {
    const self = this;
    this.apiService.get('api/Product/list-by-user?PageNumber='+(self.paginator.pageIndex+1)+
    '&PageSize='+self.paginator.pageSize+'&Keyword='+self.dataSource.filter,{},
     { 'Authorization': 'Bearer ' + self.user.object.accessToken}).subscribe(
       (data: any) => {
        self.products.length = self.paginator.pageSize*self.paginator.pageIndex;
        self.products.push(...data.object.items);
        self.products.length = data.object.total;
        self.dataSource = new MatTableDataSource<any>(self.products);
        self.dataSource._updateChangeSubscription();
        self.dataSource.paginator = self.paginator;
        self.dataSource.sort = self.sort;
       }
     )
  }

  openDialog(): void {
    const self  = this;
    this.apiService.get('api/Category/list-by-user', 
      {
      },
      { 'Authorization': 'Bearer ' + this.user.object.accessToken}
    ).subscribe((data: any) => {
      self.dialogOpenWithData({ProductName: null,
        Price: null,
        Amount: null,
        Supplier: null,
        category: data.object.items,
        CategoryId: null,
        edit: false
      });
    })
  }

  onHandleChange(event) {
    const self = this;
    console.log("event", event);
    this.apiService.get('api/Product/list-by-user?PageNumber='+(event.pageIndex+1)+
    '&PageSize='+event.pageSize+'&Keyword='+self.dataSource.filter,{},
     { 'Authorization': 'Bearer ' + self.user.object.accessToken}).subscribe(
       (data: any) => {
        self.products.length = event.pageSize*event.pageIndex;
        self.products.push(...data.object.items);
        self.products.length = data.object.total;
        self.dataSource = new MatTableDataSource<any>(self.products);
        self.dataSource._updateChangeSubscription();
        self.dataSource.paginator = self.paginator;
        self.dataSource.sort = self.sort;
        
        console.log("self.dataSource", self.dataSource.data);
       }
     )
    return event;
  }
  edit(row) {
    this.apiService.get('api/Category/list-by-user', 
      {
      },
      { 'Authorization': 'Bearer ' + this.user.object.accessToken}
    ).subscribe((data: any) => {
      this.dialogOpenWithData({ProductName: row.ProductName,
        Price: row.Price,
        Amount: row.Amount,
        Supplier: row.Supplier,
        category: data.object.items,
        CategoryId: row.CategoryId,
        Id: row.Id,
        edit: true
      });
    })
  }

  delete(row) {
    this.apiService.delete('api/Product/delete/'+row.Id,
      { 'Authorization': 'Bearer ' + this.user.object.accessToken}
    ).subscribe(
      (data: any) => {
        this._snackBar.open('Xoá thành công', '', {
          duration: 1000,
        });
        this.refreshGrid()
      },
      error => {
        this._snackBar.open('Xoá thất bại', '', {
          duration: 1000,
        });
      }
    )
  }

  view(row) {
    this.dialogOpenWithData({...row, view: true})
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
