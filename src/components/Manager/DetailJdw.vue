<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 white--text">Detail Jadwal</h3>

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
                <v-data-table :headers="headers" :items="DetailJadwals" :search="search">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small color="green" class="mr-2" @click="editHandler(item)"> mdi-pencil </v-icon>
                        <v-icon small color="red" @click="deleteHandler(item.idDetail, item.idPegawai)"> mdi-delete </v-icon>
                    </template>
                    <template v-slot:[`item.idPegawai`]="{ item }">
                        <div v-for="pgw in Pegawais" :key="pgw.idPegawai">
                            <div v-for="rol in Roles" :key="rol.idRole">
                                <p v-if="pgw.idPegawai === item.idPegawai && rol.idRole === pgw.idRole">{{ rol.namaRole }} - {{pgw.namaPgw }}</p>
                            </div>
                        </div>
                    </template>
                    <template v-slot:[`item.idJadwal`]="{ item }">
                        <div v-for="jdw in Jadwals" :key="jdw.idJadwal">
                            <p v-if="item.idJadwal === jdw.idJadwal">{{ jdw.hari}} - 
                                <span v-if="jdw.nomorShift === 1" style="color:darkred">Shift 1</span>
                                <span v-else>Shift 2</span>
                            </p>
                        </div>
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headLine">{{ formTitle }} Detail Jadwal</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select
                            v-model="form.idJadwal"
                            :items="Jadwals"
                            :item-text="item => item.hari +' - '+ item.nomorShift"
                            item-value="idJadwal"
                            label="Jadwal"
                            required
                        ></v-select>
                        <v-select v-if="inputType === 'Tambah'"
                            v-model="form.idPegawai"
                            :items="Pegawais"
                            item-text="namaPgw"
                            item-value="idPegawai"
                            label="Pegawai"
                            required
                        ></v-select>
                        <v-select v-else
                            v-model="form.idPegawai"
                            :items="Pegawais"
                            item-text="namaPgw"
                            item-value="idPegawai"
                            label="Pegawai"
                            disabled="disable"
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
export default {
    name: "MgrJadwal",
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
                    text: "Hari - Shift",
                    align: "start",
                    sortable: true,
                    value: "idJadwal",
                },
                { text: "Role - Nama Pegawai", value: "idPegawai", align: "start", sortable: true, },
               
                { text: "Actions", value: "actions", align: "center" },
            ],

            DetailJadwal: new FormData,
            DetailJadwals: [],
            Jadwals: [],
            Roles: [],
            Pegawais: [],
            form: {
              idJadwal: null,
              idPegawai: null,
            },

            deleteId: null,
            deletePgwId: null,
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
            var url = this.$api + '/detailjdw';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.DetailJadwals = response.data.data;
            })
        },
        save(){
            this.DetailJadwal.append('idJadwal', this.form.idJadwal);
            this.DetailJadwal.append('idPegawai', this.form.idPegawai);

            var nomorShiftUrl = this.$api + '/pegawai/'+ this.form.idPegawai + '/' + 1;
            this.load = true;
            this.$http.get(nomorShiftUrl, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                // }
            }).then(respond => {
                respond.data.message;
                var url = this.$api + '/detailjdw'
                this.load = true;
                this.$http.post(url, this.DetailJadwal, {
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
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        update(){
            let newData = {
                idJadwal: this.form.idJadwal,
                idPegawai: this.form.idPegawai,
            };

            var url = this.$api + '/detailjdw/' + this.editId;
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
            console.log(this.deletePgwId);
            var nomorShiftUrl = this.$api + '/pegawai/'+ this.deletePgwId + '/' + -1;
            this.load = true;
            this.$http.get(nomorShiftUrl, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                // }
            }).then(respond => {
                respond.data.message;
                var url = this.$api + '/detailjdw/' + this.deleteId;
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
                    location.reload();
                    this.load = false;
                });
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.idDetail;

            this.form.idJadwal = item.idJadwal;
            this.form.idPegawai = item.idPegawai;
            this.dialog = true;
        },
        deleteHandler(id, idPgw){
            this.deleteId = id;
            this.deletePgwId = idPgw;
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
              hari: null,
              nomorShift: null,
            };
        },
        getRole(){
             var url = this.$api + '/role';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.Roles = response.data.data;
            })
        },
        getPegawai(){
             var url = this.$api + '/pegawai';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.Pegawais = response.data.data;
            })
        },
        getJadwal(){
             var url = this.$api + '/jadwal';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.Jadwals = response.data.data;
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
        this.getRole();
        this.getPegawai();
        this.getJadwal();
    },
}
</script>