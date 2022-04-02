<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 font-color-white white--text">Transaksi</h3>

        <div style="width:940px;overflow-x:auto;">
            <v-card>
                <v-card-title>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn color="purple" dark @click="dialog = true"> Tambah </v-btn>
                </v-card-title>
                <v-data-table :headers="headers" :items="transaksis" :search="search">
                    <template v-slot:[`item.idMobil`]="{ item }">
                        <div v-for="mob in mobils" :key="mob.idMobil">
                            <p v-if="mob.idMobil === item.idMobil">{{ mob.namaMbl }}</p>
                        </div>
                    </template>
                    <template v-slot:[`item.idPegawai`]="{ item }">
                        <div v-for="pgw in pegawais" :key="pgw.idPegawai">
                            <p v-if="pgw.idPegawai === item.idPegawai">{{ pgw.namaPgw }}</p>
                        </div>
                    </template>
                    <template v-slot:[`item.idDriver`]="{ item }">
                        <div v-for="itm in drivers" :key="itm.idDriver">
                            <p v-if="itm.idDriver === item.idDriver">{{ itm.namaDrv }}</p>
                        </div>
                            <p v-if="item.idDriver === null && item.idDriver <= 0">Tanpa Driver</p>
                    </template>
                    <template v-slot:[`item.idPromo`]="{ item }">
                        <div v-for="itm in promos" :key="itm.idPromo">
                            <p v-if="itm.idPromo === item.idPromo">{{ itm.kodePrm }}</p>
                        </div>
                            <p v-if="item.idPromo === null && item.idPromo <= 0">Tanpa Promo</p>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <td>
                            <tr>
                                <v-icon v-if="item.statusTransaksi !== 'Gagal'" small color="green" class="mr-2" @click="editHandler(item)"> mdi-pencil </v-icon>
                                <v-icon v-if="item.statusTransaksi === 'Belum Verifikasi'" small color="red" @click="deleteHandler(item.idTransaksi)"> mdi-delete </v-icon>
                            </tr>
                            <tr>
                                <v-btn v-if="item.statusTransaksi === 'Selesai'" x-small color="purple" dark @click="cetakNota(item)"> Cetak Nota </v-btn>
                            </tr>
                        </td>
                    </template>
                    <template v-slot:[`item.tglSewaAwal`]="{ item }">
                        <p style="width:90px;">{{item.tglSewaAwal}}</p>
                    </template>
                    <template v-slot:[`item.tglSewaAkhir`]="{ item }">
                        <p style="width:90px;">{{item.tglSewaAkhir}}</p>
                    </template>
                    <template v-slot:[`item.idTransaksiGenerated`]="{ item }">
                        <p style="width:120px;">{{item.idTransaksiGenerated}}</p>
                    </template>

                </v-data-table>
            </v-card>
        </div>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headLine">{{ formTitle }} Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>

                        <v-select v-if="formTitle === 'Tambah' || this.form.statusTransaksi === 'Belum Verifikasi'"
                            v-model="form.idMobil"
                            :items="mobils"
                            v-on:change="sewaAkhirCheck"
                            item-text="namaMbl"
                            item-value="idMobil"
                            label="Mobil"
                            required
                        ></v-select>

                        <v-select v-if="formTitle === 'Tambah' || this.form.statusTransaksi === 'Belum Verifikasi'"
                            v-model="form.pakaiDriver"
                            :items="pakaiDriver"
                            v-on:change="DriverCheck"
                            label="Pakai Driver"
                            required
                        ></v-select>

                        <v-text-field
                            v-if="form.statusTransaksi !== 'Selesai'"
                            v-model="form.metodePembayaran"
                            label="Metode Pembayaran"
                            required
                        ></v-text-field>

                        <div v-if="formTitle === 'Tambah' || this.form.statusTransaksi === 'Belum Verifikasi'" style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="tgLh" >Tanggal Mulai Sewa: </label>
                            <input type="date" 
                                name="tgLh"
                                v-model="form.tglSewaAwal"
                                label="Tanggal Sewa Awal"
                                required
                            />
                        </div>

                        <div v-if="formTitle === 'Tambah' || this.form.statusTransaksi === 'Belum Verifikasi'" style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="tgLh" >Tanggal Selesai Sewa: </label>
                            <input type="date" 
                                name="tgLh"
                                v-model="form.tglSewaAkhir"
                                v-on:change="sewaAkhirCheck"
                                label="Tanggal Sewa Akhir"
                                required
                            />
                        </div>

                        <div v-if="formTitle === 'Tambah' || this.form.statusTransaksi === 'Belum Verifikasi'" style="text-align:left;font-size:17px;margin-top:50px;margin-bottom:5px;">
                            <label for="tgLh" >Sub Total: </label>
                            <input type="text" 
                                name="tgLh"
                                v-model="form.subTotal"
                                label="Tanggal Sewa Akhir"
                                disabled="true"
                            />
                        </div>

                        <v-select v-if="formTitle === 'Tambah' || this.form.statusTransaksi === 'Belum Verifikasi'"
                            v-model="form.idPromo"
                            :items="promos"
                            :item-text="item => item.kodePrm +' - '+ item.jenisPrm + ' ('+ item.diskonPrm +'%)'"
                            v-on:change="hitungTotalHarga"
                            item-value="idPromo"
                            label="Promo"
                            required
                        ></v-select>
                        
                        <div v-if="formTitle === 'Tambah' || this.form.statusTransaksi === 'Belum Verifikasi'" style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="tgLh" >Tanggal Pengembalian: </label>
                            <input type="date" 
                                name="tgLh"
                                v-model="form.tglPengembalian"
                                label="Tanggal Sewa Akhir"
                                required
                            />
                        </div>

                        <div v-if="form.statusTransaksi !== 'Selesai'" style="text-align:left;font-size:17px;margin-top:50px;margin-bottom:5px;">
                            <label for="tgLh" >Total Harga Akhir: </label>
                            <input type="text" 
                                name="tgLh"
                                v-model="form.totalHargaAkhir"
                                label="Tanggal Sewa Akhir"
                                disabled="true"
                            />
                        </div>

                        <v-text-field
                            v-if="formTitle !== 'Tambah' && form.pakaiDriver === '1' && form.statusTransaksi !== 'Belum Verifikasi'"
                            v-model="form.ratingDriver"
                            label="Rating Driver (1 - 10)"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-if="formTitle !== 'Tambah' && form.statusTransaksi !== 'Belum Verifikasi'"
                            v-model="form.ratingPerusahaan"
                            label="Rating Perusahaan (1 - 10)"
                            required
                        ></v-text-field>

                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="purple darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="purple darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Apakah anda ingin membatalkan transaksi?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="purple darken-1" text @click="dialogDelete = false">Cancel</v-btn>
              <v-btn color="purple darken-1" text @click="deleteData">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar
            v-model="snackbar"
            :timeout="2000" :color="color" bottom>
            {{ error_message }}
        </v-snackbar>

    </v-main>
</template>

<script>

import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
    name: "CstTrnsk",
    data() {
        return {
            inputType: 'Tambah',
            load: false,
            snackbar: false,
            error_message: '',
            color: '',

            search: null,
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            headers: [
                {
                    text: "ID Transaksi",
                    align: "start",
                    sortable: true,
                    value: "idTransaksiGenerated",
                },
                
                { text: "Mobil", value: "idMobil" },
                { text: "Driver", value: "idDriver" },
                { text: "Tanggal Sewa", value: "tglSewaAwal" },
                { text: "Tanggal Selesai", value: "tglSewaAkhir" },
                { text: "Metode Pembayaran", value: "metodePembayaran" },
                { text: "Sub Total", value: "subTotal" },
                { text: "Nama Pegawai", value: "idPegawai" },
                { text: "Nama Promo", value: "idPromo" },
                { text: "Tanggal Pengembalian", value: "tglPengembalian" },
                { text: "Status", value: "statusTransaksi" },
                { text: "Total Harga", value: "totalHargaAkhir" },
                { text: "Rating Driver", value: "ratingDriver" },
                { text: "Rating Perusahaan", value: "ratingPerusahaan" },

                { text: "Actions", value: "actions" },
            ],

            pakaiDriver: [
                { text: "Ya", value: "1" },
                { text: "Tidak", value: "0" },
            ],

            transaksi: new FormData,
            transaksis: [],
            mobils: [],
            drivers: [],
            pegawais: [],
            promos: [],
            customerNow: [],

            form: {
              idMobil: null,
              idDriver: null,
              tglSewaAwal: null,
              tglSewaAkhir: null,
              metodePembayaran: null,
              subTotal: 0,
              idPromo: null,
              tglPengembalian: null,
              totalHargaAkhir: 0,
              ratingDriver: null,
              ratingPerusahaan: null,
              statusTransaksi: null,
              
            },

            deleteId: null,
            editId: null,
            selectedDriver: null,
            hargaDriver: null,
            hargaMobil: null,
            potonganPromo: null,
            oldRatingDriver: null,
           
        }
    },

    methods: {
        DriverCheck(){
            if(this.form.pakaiDriver === '0')
            {
                if(this.customerNow['statusDokumenCust'] === 0)
                {
                    this.form.pakaiDriver = '1';
                    this.selectedDriver = this.drivers[Math.floor(Math.random() * this.drivers.length)];
                    this.error_message = "Dokumen anda tidak terverifikasi, silahkan sewa beserta driver";
                    this.color = "red";
                    this.snackbar = true;
                }
            }
            else
            {
                if(this.inputType === 'Tambah')
                {
                    this.selectedDriver = this.drivers[Math.floor(Math.random() * this.drivers.length)];
                }
            }
            
            console.log(this.selectedDriver);
            this.sewaAkhirCheck();
        },
        sewaAkhirCheck()
        {
            if(this.inputType !== 'Tambah')
            {
                if(this.form.pakaiDriver === '1')
                {
                    for(var f=0; f<this.drivers.length; f++)
                    {
                        if(this.drivers[f]['idDriver'] === this.form.idDriver)
                        {
                            this.selectedDriver = this.drivers[f];
                            break;
                        }
                    }
                }
                else
                {
                    this.selectedDriver = null;
                    this.hargaDriver = 0;
                }
            }
            var hari = moment(this.form.tglSewaAkhir).diff(moment(this.form.tglSewaAwal), 'days') + 1;
            if(hari < 0)
            {
                var temp = this.form.tglSewaAwal;
                this.form.tglSewaAwal = this.form.tglSewaAkhir;
                this.form.tglSewaAkhir = temp;
                hari = moment(this.form.tglSewaAkhir).diff(moment(this.form.tglSewaAwal), 'days') + 1;
            }
            if(this.form.pakaiDriver === '1')
            {
                this.hargaDriver = this.selectedDriver['tarifDrv'] * hari;
                this.form.idDriver = this.selectedDriver['idDriver'];
            }
            else
            {
                this.hargaDriver = 0;
            }

            var mobil = null;
            for(var k=0; k<this.mobils.length; k++)
            {
                if(this.mobils[k]['idMobil'] === this.form.idMobil)
                {
                    mobil = this.mobils[k];
                    break;
                }
            }
            
            if(mobil !== null)
            {
                this.hargaMobil = mobil['hargaSewa'] * hari;
            }

            this.form.subTotal = this.hargaMobil + this.hargaDriver;
            this.hitungTotalHarga();
        },
        hitungTotalHarga()
        {
            if(this.form.idPromo > 0)
            {
                var prom = null;
                for(var i=0; i<this.promos.length; i++)
                {
                    console.log(this.promos[i]);
                    if(this.promos[i]['idPromo'] === this.form.idPromo)
                    {
                        prom = this.promos[i];
                        break;
                    }
                }

                if(prom !== null)
                {
                    this.potonganPromo = (this.form.subTotal * prom['diskonPrm']) / 100;
                }
                else
                {
                    this.potonganPromo = 0;
                }
            }
            else
            {
                this.potonganPromo = 0;
            }

            this.form.totalHargaAkhir = this.form.subTotal - this.potonganPromo;
        },
        setForm(){
            if(this.inputType !== 'Tambah')
            {
                this.update();
            }
            else
            {
                this.save();
            }
        },
        readData(){
            var url = this.$api + '/transaksicust/' + localStorage.getItem("id");
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.transaksis = response.data.data;
            })
        },
        getMobil(){
             var url = this.$api + '/mobilavailable/1';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.mobils = response.data.data;
            })
        },
        getCustNow(){
             var url = this.$api + '/customer/'+ localStorage.getItem('id');
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.customerNow = response.data.data;
            })
        },
        getDriver(){
             var url = this.$api + '/driveravailable/1';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.drivers = response.data.data;
            })
        },
        getPegawai(){
             var url = this.$api + '/pegawaics';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.pegawais = response.data.data;
            })
        },
        getPromo(){
             var url = this.$api + '/promoactive/1';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.promos = response.data.data;
            })
        },
        save(){
            this.transaksi.append('idMobil', this.form.idMobil);
            if(this.form.idDriver > 0)
            {
                this.transaksi.append('idDriver', this.form.idDriver); // dikasi isniull ndak e
            }
            else
            {
                this.transaksi.append('idDriver', []);
            }
            this.transaksi.append('idCustomer', localStorage.getItem("id"));
            this.transaksi.append('tglSewaAwal', this.form.tglSewaAwal);
            this.transaksi.append('tglSewaAkhir', this.form.tglSewaAkhir);
            this.transaksi.append('metodePembayaran', this.form.metodePembayaran);
            this.transaksi.append('subTotal', this.form.subTotal); // dikalkulasi

            var randomPgw = this.pegawais[Math.floor(Math.random() * this.pegawais.length)];
            this.transaksi.append('idPegawai', randomPgw['idPegawai']);

            if(this.form.idPromo > 0)
            {
                this.transaksi.append('idPromo', this.form.idPromo); // dikasi if isnull
            }
            else
            {
                this.transaksi.append('idPromo', []);
            }
            this.transaksi.append('tglPengembalian', this.form.tglPengembalian); 
            this.transaksi.append('totalHargaAkhir', this.form.totalHargaAkhir); // ini kalkulasi 

            var url = this.$api + '/transaksi'
            this.load = true;
            this.$http.post(url, this.transaksi, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                // }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.close();
                this.readData();
                this.resetForm();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        update(){
            if(this.form.idDriver <= 0 || this.form.pakaiDriver === '0')
            {
                this.form.idDriver = null;
            }

            var rerataRatingBaru = 0;
            if(this.form.ratingDriver > 0 && this.form.idDriver > 0)
            {
                var theDriver = null;
                for(var z=0; z<this.drivers.length; z++)
                {
                    if(this.form.idDriver === this.drivers[z]['idDriver'])
                    {
                        theDriver = this.drivers[z];
                        break;
                    }
                }

                if(theDriver !== null)
                {
                    var floated = parseFloat(this.form.ratingDriver);
                    if(this.oldRatingDriver > 0 && theDriver['rerataRatingDrv'] > 0)
                    {
                        var rate = (theDriver['rerataRatingDrv'] * 2) - this.oldRatingDriver;
                        rerataRatingBaru = (rate + floated) / 2;
                    }
                    else if(this.oldRatingDriver <= 0 && theDriver['rerataRatingDrv'] > 0) 
                    {
                        rerataRatingBaru = (floated + theDriver['rerataRatingDrv']) / 2;
                    }
                    else if(this.oldRatingDriver <= 0 && theDriver['rerataRatingDrv'] <= 0)
                    {
                        rerataRatingBaru = floated;
                    }
                }
            }
            else if(this.form.ratingDriver <= 0 && this.form.idDriver > 0)
            {
                var theDriver2 = null;
                for(var f=0; f<this.drivers.length; f++)
                {
                    if(this.form.idDriver === this.drivers[f]['idDriver'])
                    {
                        theDriver2 = this.drivers[f];
                        break;
                    }
                }

                var rate2 = (theDriver2['rerataRatingDrv'] * 2) - this.oldRatingDriver;
                rerataRatingBaru = rate2;
            }

            let newData = {
                idMobil: this.form.idMobil,
                idDriver: this.form.idDriver,
                idPromo: this.form.idPromo,
                idPegawai: this.form.idPegawai,
                tglSewaAwal: this.form.tglSewaAwal,
                tglSewaAkhir: this.form.tglSewaAkhir,
                metodePembayaran: this.form.metodePembayaran,
                subTotal: this.form.subTotal,
                tglPengembalian: this.form.tglPengembalian,
                totalHargaAkhir: this.form.totalHargaAkhir,
                ratingDriver: this.form.ratingDriver,
                ratingPerusahaan: this.form.ratingPerusahaan,
            };

            console.log(this.oldRatingDriver +' -- '+ rerataRatingBaru);

            var url = this.$api + '/transaksi/' + this.editId;
            this.load = true;
            this.$http.put(url, newData, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = 'green';
                this.snackbar = true;
                this.load = false;
                let ratingData = {
                    rerataRatingDrv: rerataRatingBaru,
                };

                var urlUpd = this.$api + '/driverrating/' + this.form.idDriver;
                this.load = true;
                this.$http.put(urlUpd, ratingData, {
                    // headers: {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    // }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = 'green';
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    location.reload();
                    this.readData();
                    this.resetForm();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        deleteData(){
            var url = this.$api + '/transaksi/' + this.deleteId;
            this.load = true;
            this.$http.delete(url, {
                // headers: {
                //     'Authorization': 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = 'green';
                this.snackbar = true;
                this.load = false;
                this.close();
                location.reload();
                this.readData();
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.idTransaksi;

            this.form.idPegawai = item.idPegawai;
            this.form.idMobil = item.idMobil;
            this.form.idPromo = item.idPromo;
            this.form.idDriver = item.idDriver;
            this.form.tglSewaAwal = item.tglSewaAwal;
            if(item.idDriver > 0)
            {
                this.form.pakaiDriver = "1";
            }
            else
            {
                this.form.pakaiDriver = "0";
            }
            this.form.tglSewaAkhir = item.tglSewaAkhir;
            this.form.metodePembayaran = item.metodePembayaran;
            this.form.subTotal = item.subTotal;
            this.form.tglPengembalian = item.tglPengembalian;
            this.form.totalHargaAkhir = item.totalHargaAkhir;
            this.form.ratingDriver = item.ratingDriver;
            this.oldRatingDriver = item.ratingDriver;
            this.form.ratingPerusahaan = item.ratingPerusahaan;
            this.form.statusTransaksi = item.statusTransaksi;

            this.dialog = true;
        },
        deleteHandler(idTransaksi){
            this.deleteId = idTransaksi;
            this.dialogDelete = true;
        },
        close(){
            this.dialog = false;
            this.inputType = 'Tambah';
            this.dialogDelete = false;
            this.readData();
        },
        cancel(){
            this.resetForm();
            this.readData();
            this.dialog = false;
            this.dialogDelete = false;
            this.inputType = 'Tambah';
        },
        resetForm(){
            this.form = {
              idMobil: null,
              idDriver: null,
              tglSewaAwal: null,
              tglSewaAkhir: null,
              metodePembayaran: null,
              subTotal: 0,
              idPromo: null,
              tglPengembalian: null,
              totalHargaAkhir: 0,
              ratingDriver: null,
              ratingPerusahaan: null,
              pakaiDriver: null,
              statusTransaksi: null,
            };
            this.selectedDriver = null;
            this.hargaDriver = null;
            this.hargaMobil = null;
            this.potonganPromo = null;
            this.oldRatingDriver = null;
        },
        cetakNota(item)
        {
            let pdfName = 'Nota-' + item.idTransaksiGenerated; 
            var doc = new jsPDF();
            var countHari = moment(item.tglSewaAkhir).diff(moment(item.tglSewaAwal), 'days') + 1;
            var driverSelect = this.GetDriverTran(item.idDriver);
            var promoSelect = this.GetPromoTran(item.idPromo);
            var mobilSelect = this.GetMobilTran(item.idMobil);
            var csName = this.GetNamaCustServ(item.idPegawai);

            doc.setFontSize(14);
            doc.text("Nota Transaksi", 90, 20); // 10 itu ke kanan, 80 itu kebawah
            doc.text("Atma Jogja Rental", 87, 30); 
            doc.setFontSize(12);
            doc.text("--------------------------------------------------------------------------------------------------------------------------------", 15, 40); 
            doc.text("Nota Transaksi Sewa Mobil", 15, 50); 

            var kodePromo = '';
            if(item.idPromo > 0)
            {
                kodePromo = promoSelect['kodePrm']
            }

            autoTable(doc, { // Atma Rental
                margin: {top: 70},
                head: [['Atma Rental', '', '', '']],
                body: [
                    [item.idTransaksiGenerated, '', '', moment(String(new Date())).format('YY-MM-DD, HH:MM')],
                    ['', '', '', ''],
                    ['CUST:', this.customerNow['namaCust'] , 'PRO:', kodePromo],
                    ['CS  :', csName , '', ''],
                    ['DRV :', driverSelect.namaDrv , '', ''],
                ],
            });
            autoTable(doc, { // Nota Transaksi
                margin: {top: 85},
                head: [['Nota Transaksi', '', '', '']],
                body: [
                    ["Tanggal Mulai", moment(item.tglSewaAwal).format('YY-MM-DD'), '', ''],
                    ["Tanggal Selesai", moment(item.tglSewaAkhir).format('YY-MM-DD'), '', ''],
                    ["Tanggal Pengembalian", moment(item.tglPengembalian).format('YY-MM-DD'), '', ''],
                    
                ],
            });

            var dataHold = {
                Item: driverSelect['namaDrv'],
                Satuan: driverSelect['tarifDrv'],
                Durasi: countHari + ' hari',
                SubTotal: (driverSelect['tarifDrv'] * countHari),
            };

            var subTotal = null;
            if(item.idDriver <= 0)
            {
                dataHold.Item = "";
                dataHold.Satuan = "";
                dataHold.Durasi = "";
                dataHold.SubTotal = "";
                subTotal = (mobilSelect['hargaSewa'] * countHari);
            }
            else
            {
                subTotal = (mobilSelect['hargaSewa'] * countHari) + dataHold.SubTotal;
            }


            autoTable(doc, { // Detail Harga
                margin: {top: 105},
                head: [['Item', 'Satuan', 'Durasi', 'Sub Total']],
                body: [
                    [mobilSelect['namaMbl'], mobilSelect['hargaSewa'], countHari + ' hari', (mobilSelect['hargaSewa'] * countHari)],
                    [dataHold.Item, dataHold.Satuan, dataHold.Durasi, dataHold.SubTotal],
                    ['', '', '', subTotal],
                    
                ],
            });

            var diskon = 0;
            var denda = 0;
            var totalHarga = 0;

            if(item.idPromo > 0)
            {
                diskon = (subTotal * promoSelect['diskonPrm']) / 100;
                totalHarga = subTotal - diskon;
            }
            else
            {
                totalHarga = subTotal;
            }

            //ccke denda disini
            if(item.idPromo > 0)
            {// berpromo
                if(totalHarga !== item.totalHargaAkhir)
                {
                    var totLama = subTotal - diskon;
                    denda = item.totalHargaAkhir - totLama;
                }
            }
            else
            {
                if(subTotal !== item.totalHargaAkhir) // ada denda
                {
                    denda = item.totalHargaAkhir - subTotal;
                }
            }

            autoTable(doc, { // Totalan
                margin: {top: 135},
                head: [['', '', '', '']],
                body: [
                    ['Cust', 'CS', 'Disc', diskon],
                    ['', '', 'Denda', denda],
                    ['', '', 'Total', item.totalHargaAkhir],
                    [this.customerNow['namaCust'], csName, '', ''],
                ],
            });

            autoTable(doc, { // Penjelasan
                margin: {top: 185},
                head: [['Nomor Transaksi : ' + item.idTransaksiGenerated, '']],
                body: [
                    ['Cust   :', 'Nama Customer'],
                    ['CS     :', 'Nama Customer Service'],
                    ['DRV    :', 'Nama Driver'],
                    ['PRO    :', 'Kode Promo'],
                ],
            });

            doc.save(pdfName + '.pdf');
        },
        GetNamaCustServ(id)
        {
            for(var c=0;c<this.pegawais.length ;c++)
            {
                if(id === this.pegawais[c]['idPegawai'])
                {
                    return this.pegawais[c]['namaPgw'];
                }
            }
            return '';
        },
        GetPromoTran(id)
        {
            if(id > 0)
            {
                for(var c=0;c<this.promos.length;c++)
                {
                    if(id === this.promos[c]['idPromo'])
                    {
                        return this.promos[c];
                    }
                }
                return null;
            }
            else
            {
                return null;
            }
        },
        GetDriverTran(id)
        {
            if(id > 0)
            {
                for(var c=0;c<this.drivers.length;c++)
                {
                    if(id === this.drivers[c]['idDriver'])
                    {
                        return this.drivers[c];
                    }
                }
                return '';
            }
            else
            {
                return '-';
            }
        },
        GetMobilTran(id)
        {
            if(id > 0)
            {
                for(var c=0;c<this.mobils.length;c++)
                {
                    if(id === this.mobils[c]['idMobil'])
                    {
                        return this.mobils[c];
                    }
                }
                return '';
            }
            else
            {
                return '-';
            }
        },
    },

    computed: {
        formTitle(){
            return this.inputType;
        },
    },
    mounted(){
        this.readData();
        this.getMobil();
        this.getDriver();
        this.getPegawai();
        this.getPromo();
        this.getCustNow();
    },
};
</script>