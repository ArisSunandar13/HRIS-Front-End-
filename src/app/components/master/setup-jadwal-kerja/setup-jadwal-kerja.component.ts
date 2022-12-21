import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/api.service';
import { ModalSetupJadwalKerjaComponent } from './modal-setup-jadwal-kerja/modal-setup-jadwal-kerja.component';
import * as moment from 'moment';
moment.locale('id');

@Component({
  selector: 'app-setup-jadwal-kerja',
  templateUrl: './setup-jadwal-kerja.component.html',
  styleUrls: ['./setup-jadwal-kerja.component.css'],
})
export class SetupJadwalKerjaComponent implements OnInit {
  tableDetail = 'ms_karyawan/';
  dataDetail!: any;
  dataDetailJadwalKerja!: any;
  dataCategory!: any;
  dataUpload!: any;
  dataIndividu!: any;
  catchResult: any;
  getMaxId = 0;
  month!: any;
  year!: any;
  yearMonth!: any;

  constructor(private api: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllData();
    this.month = moment().month() + 1;
    this.year = moment().year();
    this.month.toString().length === 1
      ? (this.yearMonth = this.year + '-0' + this.month)
      : (this.yearMonth = this.year + '-' + this.month);
  }

  tambahData() {
    const dialogRef = this.dialog.open(ModalSetupJadwalKerjaComponent, {
      data: { name: 'tambah' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result === 'simpan') {
        this.catchResult = this.api.catchData();
        this.api.postData(this.tableDetail, this.catchResult).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }

  editDataDetail(i: number) {
    let id = this.dataDetail[0].id
    const dialogRef = this.dialog.open(ModalSetupJadwalKerjaComponent, {
      data: {
        name: 'editDetail',
        data: {
          all: this.dataDetail[0],
          dataJadwalKerja: this.dataDetail[0].jadwal_kerja[i],
          indexJadwalKerja: i
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'simpan') {
        this.catchResult = this.api.catchData();
        this.api.updateData(this.tableDetail, this.catchResult, id).subscribe(() => {
          this.ngOnInit();
        });
      }
      this.ngOnInit();
    });
  }

  editData(data: any) {
    let id = data.id;
    const dialogRef = this.dialog.open(ModalSetupJadwalKerjaComponent, {
      data: { name: 'edit', data: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'simpan') {
        this.catchResult = this.api.catchData();
        let data = this.catchResult;
        this.api.updateData(this.tableDetail, data, id).subscribe(() => {
          this.ngOnInit();
        });
      }
      this.ngOnInit();
    });
  }

  deleteData(id: number) {
    const dialogRef = this.dialog.open(ModalSetupJadwalKerjaComponent, {
      data: { name: 'delete' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'ya') {
        this.api.deleteData(this.tableDetail + id).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }

  getAllData() {
    this.api.getData(this.tableDetail).subscribe((res) => {
      this.dataDetail = res;
      this.dataDetailJadwalKerja = res[0].jadwal_kerja;
      this.dataIndividu = res;
      this.dataCategory = res;
      this.dataUpload = res;
    });
  }

  dateFormat(date: any) {
    return moment(date, 'DD-MM-YYYY').format('DD MMM YYYY');
  }

  searchData() {
    this.getAllData();
  }
}
