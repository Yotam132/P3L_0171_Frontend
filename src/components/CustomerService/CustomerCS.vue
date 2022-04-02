<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 white--text">Customer</h3>

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
                <v-data-table :headers="headers" :items="Customers" :search="search">
                    <template v-slot:[`item.actions`]="{ item }">
                        <td>
                            <tr>
                                <v-btn x-small color="purple" dark @click="ubahStatus(item.idCustomer)" style="margin:5px;"> Ubah Status </v-btn>
                            </tr>
                        </td>
                    </template>

                    <template v-slot:[`item.statusDokumenCust`]="{ item }">
                        <p v-if="item.statusDokumenCust === 1" style="color:lightgreen">Lolos</p>
                        <p v-else style="color:red">Tidak Lolos</p>
                    </template>
                    <template v-slot:[`item.idCustomerGenerated`]="{ item }">
                        <p style="width:120px;">{{item.idCustomerGenerated}}</p>
                    </template>
                    <template v-slot:[`item.namaCust`]="{ item }">
                        <p style="width:120px;">{{item.namaCust}}</p>
                    </template>
                    <template v-slot:[`item.kartuPengenalCust`]="{ item }">
                        <img style="width:150px;height:150px;" v-bind:src="item.kartuPengenalCust" />
                    </template>
                    <template v-slot:[`item.simCust`]="{ item }">
                        <img style="width:150px;height:150px;" v-bind:src="item.simCust" />
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <!-- <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headLine">{{ formTitle }} Customer</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.kodePrm"
                            label="Kode Customer"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.jenisPrm"
                            label="Jenis Customer"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.keteranganPrm"
                            label="Keterangan"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.diskonPrm"
                            label="Diskon"
                            required
                        ></v-text-field>
                                                
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
        </v-dialog> -->

        <v-snackbar
            v-model="snackbar"
            :timeout="2000" :color="color" bottom>
            {{ error_message }}
        </v-snackbar>

    </v-main>
</template>

<script>
export default {
    name: "MgrPromo",
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
                    text: "ID Customer",
                    align: "start",
                    sortable: true,
                    value: "idCustomerGenerated",
                },
                { text: "Nama", value: "namaCust", align: "start" },
                { text: "Email", value: "emailCust", align: "start" },
                { text: "No. Telepon", value: "noTelpCust", align: "start" },
                { text: "Kartu Pengenal", value: "kartuPengenalCust", align: "center" },
                { text: "SIM", value: "simCust", align: "center" },
                { text: "Status Verifikasi Dokumen", value: "statusDokumenCust", align: "center" },
               
                { text: "Actions", value: "actions", align: "center" },
            ],

            Customer: new FormData,
            Customers: [],
            form: {
              kodePrm: null,
              jenisPrm: null,
              keteranganPrm: null,
              diskonPrm: null,
              statusPrm: null,
            },

            deleteId: null,
            editId: null,
           
        }
    },

    methods: {
        // setForm(){
        //     if(this.inputType !== 'Tambah')
        //     {
        //         this.update();
        //     }
        //     else
        //     {
        //         this.save();
        //     }
        // },
        readData(){
            var url = this.$api + '/customer';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.Customers = response.data.data;
            })
        },
        ubahStatus(statId){
            var url = this.$api + '/customerstatdokumen/'+ statId;
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            })
            .then(response => {
                response;
                location.reload();
            })
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
              kodePrm: null,
              jenisPrm: null, 
              keteranganPrm: null, 
              diskonPrm: null,  
            };
        },
    },

    computed: {
        formTitle(){
            return this.inputType;
        },
    },
    mounted(){
        this.readData();
    },
}
</script>