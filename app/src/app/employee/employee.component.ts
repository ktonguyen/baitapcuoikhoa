import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { ApiService } from '../api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

interface EmployeeData {
  id: number;
  maPhongBan: number;
  maChucVu: number;
  trangThai: number;
  hoTen: string;
  soDienThoai: string;
  mail: string;
  anhDaiDien: string;
  namSinh: Date;
}
interface addData {
  maPhongBan: number;
  maChucVu: number;
  trangThai: number;
  hoTen: string;
  soDienThoai: string;
  mail: string;
  anhDaiDien: string;
  namSinh: Date;
}
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})


export class EmployeeComponent implements OnInit {

  displayedColumns = ['id', 'maPhongBan', 'maChucVu', 'hoTen', 'soDienThoai', 'namSinh','actionsColumn'];
  dataSource: any;
  user: any;
  products: any[];
  selection: SelectionModel<EmployeeData>;
  length: any;
  pageIndex: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private apiService: ApiService, public dialog: MatDialog, private _snackBar: MatSnackBar) { 
    
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>();
    this.selection = new SelectionModel<EmployeeData>(true, []);
    this.user = JSON.parse(localStorage.getItem('userLogin'));
    this.length = 0;
    this.pageIndex = 0;
    console.log("this.user ", this.user);
  }

  ngAfterViewInit() {
    const self = this;

    this.apiService.get('api/DanhBa/list-nhan-vien?PageNumber=1&PageSize=5&Keyword=&maPhongBan=-1&maChucVu=-1&trangThai=-1', {},
      { 'Authorization': 'Bearer ' + this.user.object.accessToken }).subscribe(
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

  dialogOpenWithData(dataRow) {
    const self = this;
    const dialogRef = this.dialog.open(AddEmployeeDialog, {
      width: '400px',
      data: dataRow
    });
    
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed', result);

      if (result.edit) {
        delete result.edit;
        console.log(result);
        this.apiService.put('api/DanhBa/edit-nhan-vien',
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
        this.apiService.post('api/DanhBa/add-nhan-vien',
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
              maPhongBan: result.maPhongBan,
              maChucVu: result.maChucVu,
              Trangthai: result.trangThai,
              HoTen: result.hoTen,
              SoDienThoai: result.soDienThoai,
              Mail: result.mail,
              AnhDaiDien: result.anhDaiDien,
              NamSinh: result.namSinh,
              Id: data.object.data
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
    this.apiService.get('api/DanhBa/list-nhan-vien?PageNumber=' + (self.paginator.pageIndex + 1) +
      '&PageSize=' + self.paginator.pageSize + '&Keyword=' + self.dataSource.filter + '&maPhongBan=-1&maChucVu=-1&trangThai=-1', {},
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
      maPhongBan: null,
      maChucVu: null,
      Trangthai: null,
      HoTen: null,
      SoDienThoai: null,
      Mail: null,
      AnhDaiDien: null,
      NamSinh: null,
      edit : false
    });
  }

  onHandleChange(event) {
    const self = this;
    console.log("event", event);
    this.apiService.get('api/DanhBa/list-nhan-vien?PageNumber=' + (event.pageIndex + 1) +
      '&PageSize=' + event.pageSize + '&Keyword=' + self.dataSource.filter + '&maPhongBan=-1&maChucVu=-1&trangThai=-1', {},
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
      maPhongBan: row.maPhongBan,
      maChucVu: row.maChucVu,
      Trangthai: row.trangThai,
      HoTen: row.hoTen,
      SoDienThoai: row.soDienThoai,
      Mail: row.mail,
      AnhDaiDien: row.anhDaiDien,
      NamSinh: row.namSinh,
      Id: row.Id,
      edit: true
    });
    console.log(row);
  }

  delete(row) {
    this.apiService.delete('api/DanhBa/delete-nhan-vien/' + row.Id,
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
  selector: 'add-employee',
  templateUrl: './add.employee.component.html',
})
export class AddEmployeeDialog {

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: addData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
