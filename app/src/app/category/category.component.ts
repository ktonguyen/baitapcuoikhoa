import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from '../api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

interface CategoryData {
  id: number;
  categoryName: string;
}
interface AddCategoryData {
  categoryName: string;
}
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, AfterViewInit {

  displayedColumns = ['id', 'categoryName', 'actionsColumn'];
  dataSource: any;
  user: any;
  products: any[];
  selection: SelectionModel<CategoryData>;
  length: any;
  pageIndex: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private apiService: ApiService, public dialog: MatDialog, private _snackBar: MatSnackBar) { 
  }

  ngOnInit() {
    
    this.dataSource = new MatTableDataSource<any>();
    this.selection = new SelectionModel<CategoryData>(true, []);
    this.user = JSON.parse(localStorage.getItem('userLogin'));
    this.length = 0;
    this.pageIndex = 0;
    console.log("this.user ", this.user);
  }
  ngAfterViewInit() {
    const self = this;
    
    this.apiService.get('api/Category/list-by-user?PageNumber=1&PageSize=10&Keyword=',{},
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
    this.dataSource.filter = filterValue.trim().toLowerCase()
    this.refreshGrid();
  }
  
  dialogOpenWithData(dataRow) {
    const self = this;
    const dialogRef = this.dialog.open(AddCategoryDialog, {
      width: '400px',
      data: dataRow
    });
    
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed', result);

      if (result.edit) {
        delete result.edit;
        console.log(result);
        this.apiService.put('api/Category/edit',
          {
            ...result
            
          },
          { 'Authorization': 'Bearer ' + this.user.object.accessToken }
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
        this.apiService.post('api/Category/add',
          {
            ...result
          },
          { 'Authorization': 'Bearer ' + this.user.object.accessToken }
        ).subscribe(
          (data: any) => {
            self._snackBar.open('Tạo mới thành công', '', {
              duration: 1000,
            });
            self.dataSource.data.push({
              categoryName: result.categoryName,
              id: data.object.data
            })
            self.dataSource._updateChangeSubscription();
            self.refreshGrid();
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
    this.apiService.get('api/Category/list-by-user?PageNumber=' + (self.paginator.pageIndex + 1) +
      '&PageSize=' + self.paginator.pageSize + '&Keyword=' + self.dataSource.filter, {},
      { 'Authorization': 'Bearer ' + self.user.object.accessToken }).subscribe(
        (data: any) => {
          self.products.length = self.paginator.pageSize * self.paginator.pageIndex;
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
    const self = this;
    self.dialogOpenWithData({
      categoryName: null,
      id: 0
    });
  }
onHandleChange(event) {
  const self = this;
  console.log("event", event);
  this.apiService.get('api/Category/list-by-user?PageNumber=' + (event.pageIndex + 1) +
    '&PageSize=' + event.pageSize + '&Keyword=' + self.dataSource.filter, {},
    { 'Authorization': 'Bearer ' + self.user.object.accessToken }).subscribe(
      (data: any) => {
        self.products.length = event.pageSize * event.pageIndex;
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
  this.dialogOpenWithData({
    categoryName: row.categoryName,
    id: row.id,
    edit: true
  });
  console.log(row);
}

delete(row) {
  this.apiService.delete('api/Category/delete/' + row.id,
    { 'Authorization': 'Bearer ' + this.user.object.accessToken }
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
  this.dialogOpenWithData({ ...row, view: true })
}
}
@Component({
  selector: 'add-category',
  templateUrl: './add.category.component.html',
})
export class AddCategoryDialog {

  constructor(
    public dialogRef: MatDialogRef<AddCategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddCategoryData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
