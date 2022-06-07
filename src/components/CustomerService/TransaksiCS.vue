<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 white--text">Transaksi</h3>

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
                </v-card-title>
                <v-data-table :headers="headers" :items="transaksis" :search="search">
                    <template v-slot:[`item.actions`]="{ item }">
                        <td>
                            <tr>
                                <v-btn v-if="item.statusTransaksi != 'Selesai'" x-small color="purple" dark @click="editHandler(item)" style="margin:5px;"> Ubah Status </v-btn>
                                <v-icon v-if="item.statusTransaksi == 'Belum Verifikasi'" small color="red" @click="deleteHandler(item.idTransaksi)"> mdi-delete </v-icon>
                            </tr>
                        </td>
                    </template>
                    <template v-slot:[`item.idCustomer`]="{ item }">
                        <div v-for="cst in customers" :key="cst.idCustomer">
                            <p style="width:120px;" v-if="cst.idCustomer == item.idCustomer">{{ cst.namaCust }}</p>
                        </div>
                    </template>
                    <template v-slot:[`item.idTransaksiGenerated`]="{ item }">
                        <p style="width:120px;">{{item.idTransaksiGenerated}}</p>
                    </template>
                    <template v-slot:[`item.tglSewaAwal`]="{ item }">
                        <p style="width:90px;">{{item.tglSewaAwal}}</p>
                    </template>
                    <template v-slot:[`item.tglSewaAkhir`]="{ item }">
                        <p style="width:90px;">{{item.tglSewaAkhir}}</p>
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
                        <v-select
                            v-model="form.statusTransaksi"
                            :items="statusTransaksiList"
                            label="Status Transaksi"
                            required
                        ></v-select>

                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="purple darken-1" text @click="cancel"> Batal </v-btn>
                    <v-btn color="purple darken-1" text @click="setForm"> Simpan </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Apakah anda ingin menghapus data?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="purple darken-1" text @click="dialogDelete = false">Tidak</v-btn>
              <v-btn color="purple darken-1" text @click="deleteData">Ya</v-btn>
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

export default {
    name: "CSTrans",
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
                { text: "Nama Customer", value: "idCustomer", align: "start" },
                { text: "Tanggal Sewa", value: "tglSewaAwal" },
                { text: "Tanggal Selesai", value: "tglSewaAkhir" },
                { text: "Metode Pembayaran", value: "metodePembayaran" },
                { text: "Tanggal Pengembalian", value: "tglPengembalian" },
                { text: "Status", value: "statusTransaksi" },
                { text: "Total Harga", value: "totalHargaAkhir" },
               
                { text: "Actions", value: "actions", align: "center" },
            ],
            
            statusTransaksiList: [
                { text: "Belum Verifikasi", value: "Belum Verifikasi" },
                { text: "Sedang Berjalan", value: "Sedang Berjalan" },
                { text: "Gagal", value: "Gagal" },
                { text: "Gagal Pembayaran", value: "Gagal Pembayaran" },
                { text: "Selesai", value: "Selesai" },
            ],

            Transaksi: new FormData,
            transaksis: [],
            customers: [],
            form: {
              statusTransaksi: null, 
              statusLama: null, 
              tglPengembalian: null, 
              totalHargaAkhir: null,
            },

            deleteId: null,
            editId: null,
           
        }
    },

    methods: {
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
            var url = this.$api + '/transaksipgw/' + localStorage.getItem('id');
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.transaksis = response.data.data;
            })
        },
        update(){
            if(this.form.statusTransaksi == 'Selesai')
            {
                var hari = moment(moment(this.form.tglPengembalian)).diff(moment(String(new Date())).format('YYYY-MM-DD'), 'days') + 1;
                if(hari < 0)
                {
                    var denda = 50000 * hari * -1;
                    this.form.totalHargaAkhir += denda;
                }
            }


            let newData = {
                statusTransaksi: this.form.statusTransaksi,
                totalHargaAkhir: this.form.totalHargaAkhir,
            };

            var url = this.$api + '/transaksistat/' + this.editId;
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

            this.form.statusTransaksi = item.statusTransaksi;
            this.form.statusLama = item.statusTransaksi;
            this.form.totalHargaAkhir = item.totalHargaAkhir;
            this.form.tglPengembalian = item.tglPengembalian;


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
              statusTransaksi: null, 
              statusLama: null, 
              tglPengembalian: null, 
              totalHargaAkhir: null, 
            };
        },
        getCustomer(){
             var url = this.$api + '/customer';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.customers = response.data.data;
            })
        },
    },

    computed: {
        formTitle(){
            return this.inputType;
        },
    },
    mounted(){
        this.readData();
        this.getCustomer();
    },
}
</script>