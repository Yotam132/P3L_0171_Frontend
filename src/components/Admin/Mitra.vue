<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 white--text">Mitra</h3>

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
                <v-data-table :headers="headers" :items="Mitras" :search="search">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small color="green" class="mr-2" @click="editHandler(item)"> mdi-pencil </v-icon>
                        <v-icon small color="red" @click="deleteHandler(item.idMitra)"> mdi-delete </v-icon>
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headLine">{{ formTitle }} Mitra</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.namaMtr"
                            label="Nama Mitra"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.noKtpMtr"
                            label="Nomor KTP"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.alamatMtr"
                            label="Alamat"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.noTelpMtr"
                            label="Nomor Telepon"
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
    name: "MgrMitra",
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
                    text: "Nama Mitra",
                    align: "start",
                    sortable: true,
                    value: "namaMtr",
                },
                { text: "Nomor KTP", value: "noKtpMtr", align: "start" },
                { text: "Alamat", value: "alamatMtr", align: "start" },
                { text: "Nomor Telepon", value: "noTelpMtr", align: "start" },
               
                { text: "Actions", value: "actions", align: "center" },
            ],

            Mitra: new FormData,
            Mitras: [],
            form: {
              namaMtr: null,
              noKtpMtr: null,
              alamatMtr: null,
              noTelpMtr: null,
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
            var url = this.$api + '/mitra';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.Mitras = response.data.data;
            })
        },
        save(){
            this.Mitra.append('namaMtr', this.form.namaMtr);
            this.Mitra.append('noKtpMtr', this.form.noKtpMtr);
            this.Mitra.append('alamatMtr', this.form.alamatMtr);
            this.Mitra.append('noTelpMtr', this.form.noTelpMtr);

            var url = this.$api + '/mitra'
            this.load = true;
            this.$http.post(url, this.Mitra, {
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
            let newData = {
                namaMtr: this.form.namaMtr,
                noKtpMtr: this.form.noKtpMtr,
                alamatMtr: this.form.alamatMtr,
                noTelpMtr: this.form.noTelpMtr,
            };

            var url = this.$api + '/mitra/' + this.editId;
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
            var url = this.$api + '/mitra/' + this.deleteId;
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
        },
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.idMitra;
            this.form.namaMtr = item.namaMtr;
            this.form.noKtpMtr = item.noKtpMtr;
            this.form.alamatMtr = item.alamatMtr;
            this.form.noTelpMtr = item.noTelpMtr;
            this.dialog = true;
        },
        deleteHandler(id){
            this.deleteId = id;
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
              namaMtr: null,
              noKtpMtr: null,
              alamatMtr: null,
              noTelpMtr: null,
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