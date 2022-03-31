<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 font-color-white white--text">PENDAFTARAN</h3>

        <!-- <v-dialog max-width="600px"> -->
            <v-card>
                <v-card-title>
                    <span class="headLine">Customer</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.namaCust"
                            label="Nama Customer"
                            required
                        ></v-text-field>

                        <!-- Jika Tambah ada ini -->
                        <v-text-field v-if="formTitle === 'Tambah'"
                            v-model="form.emailCust"
                            label="Email"
                            required
                        ></v-text-field>
                        <v-text-field v-if="formTitle === 'Tambah'"
                            v-model="form.passwordCust"
                            label="Password"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="form.jenisKelaminCust"
                            :items="kelamins"
                            label="Jenis Kelamin"
                            required
                        ></v-select>

                        <v-text-field
                            v-model="form.alamatCust"
                            label="Alamat"
                            required
                        ></v-text-field>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="tgLh" >Tanggal Lahir: </label>
                            <input type="date" 
                                name="tgLh"
                                v-model="form.tglLahirCust"
                                label="Tanggal Lahir"
                                required
                            />
                        </div>

                        <v-text-field
                            v-model="form.noTelpCust"
                            label="No. Telepon"
                            required
                        ></v-text-field>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="FileKP" >Kartu Pengenal: </label>
                            <input type="file"
                                id="FileKP"
                                name="FileKP"
                                @change="readImage($event, 1)"
                                accept="image/*" 
                                required
                                />
                            <img id="SelectedImg1" v-bind:src="form.kartuPengenalCust" alt="" width="100px" height="100px" style="margin-left:-35px;">
                        </div>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="FileFoto" >SIM: </label>
                            <input type="file"
                                id="FileFoto"
                                name="FileFoto"
                                @change="readImage($event, 2)"
                                accept="image/*" 
                                required
                                />
                            <img id="SelectedImg2" v-bind:src="form.simCust" alt="" width="100px" height="100px" style="margin-left:-35px;">
                        </div>

                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="purple darken-1" text @click="setForm"> Daftar </v-btn>
                </v-card-actions>
            </v-card>
        <!-- </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Apakah anda ingin menghapus data?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="purple darken-1" text @click="dialogDelete = false">Cancel</v-btn>
              <v-btn color="purple darken-1" text @click="deleteData">OK</v-btn>
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
    name: "AdmPegawai",
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
            // headers: [
            //     {
            //         text: "Nama Pegawai",
            //         align: "start",
            //         sortable: true,
            //         value: "namaPgw",
            //     },
                
            //     { text: "Foto", value: "urlFotoPgw" },
            //     { text: "Role", value: "idRole" },
            //     { text: "Email", value: "emailPgw" },
            //     { text: "Alamat", value: "alamatPgw" },
            //     { text: "Tanggal Lahir", value: "tglLahirPgw" },
            //     { text: "Jenis Kelamin", value: "jenisKelaminPgw" },
            //     { text: "No. Telepon", value: "noTelpPgw" },

            //     { text: "Actions", value: "actions" },
            // ],

            kelamins: [
                { text: "Laki-Laki", value: "L"},
                { text: "Perempuan", value: "P"},
            ],

            customer: new FormData,
            pegawais: [],
            roles: [],

            form: {
              namaCust: null,
              alamatCust: null,
              tglLahirCust: null,
              jenisKelaminCust: null,
              emailCust: null,
              noTelpCust: null,
              kartuPengenalCust: null,
              simCust: null,
              passwordCust: null,
              
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
        // readData(){
        //     var url = this.$api + '/customer';
        //     this.$http.get(url, {
        //         // headers: {
        //         //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
        //         // }
        //     }).then(response => {
        //         this.pegawais = response.data.data;
        //     })
        // },
        save(){
            this.customer.append('namaCust', this.form.namaCust);
            this.customer.append('alamatCust', this.form.alamatCust);
            this.customer.append('tglLahirCust', this.form.tglLahirCust);
            this.customer.append('jenisKelaminCust', this.form.jenisKelaminCust);
            this.customer.append('emailCust', this.form.emailCust);
            this.customer.append('noTelpCust', this.form.noTelpCust);

            // url foto diappend ke base64
            this.customer.append('passwordCust', this.form.passwordPgw);


            var url = this.$api + '/customer'
            this.load = true;
            this.$http.post(url, this.customer, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                // }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.resetForm();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        readImage(event, urutan)
        {
            let reader = new FileReader()
            const image = event.target.files[0];
            reader.readAsDataURL(image);

            let rawImg;
            reader.onloadend = () => {
                rawImg = reader.result;
                if(urutan === 1)
                {
                    this.customer.append('kartuPengenalCust', rawImg);
                    document.getElementById('SelectedImg1').src = rawImg;
                }
                else if(urutan === 2)
                {
                    this.customer.append('simCust', rawImg);
                    document.getElementById('SelectedImg2').src = rawImg;
                }
            }
        },
        // update(){
        //     let newData = {
        //         namaPgw: this.form.namaPgw,
        //         alamatPgw: this.form.alamatPgw,
        //         tglLahirPgw: this.form.tglLahirPgw,
        //         jenisKelaminPgw: this.form.jenisKelaminPgw,
        //         noTelpPgw: this.form.noTelpPgw,
        //         urlFotoPgw: this.form.urlFotoPgw,
        //         idRole: this.form.idRole,
        //     };

        //     var url = this.$api + '/customer/' + this.editId;
        //     this.load = true;
        //     this.$http.put(url, newData, {
        //         // headers: {
        //         //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
        //         // }
        //     }).then(response => {
        //         this.error_message = response.data.message;
        //         this.color = 'green';
        //         this.snackbar = true;
        //         this.load = false;
        //         this.close();
        //         location.reload();
        //         this.readData();
        //         this.resetForm();
        //         this.inputType = 'Tambah';
        //     }).catch(error => {
        //         this.error_message = error.response.data.message;
        //         this.color = "red";
        //         this.snackbar = true;
        //         this.load = false;
        //     });
        // },
        // deleteData(){
        //     var url = this.$api + '/customer/' + this.deleteId;
        //     this.load = true;
        //     this.$http.delete(url, {
        //         // headers: {
        //         //     'Authorization': 'Bearer ' + localStorage.getItem('token')
        //         // }
        //     }).then(response => {
        //         this.error_message = response.data.message;
        //         this.color = 'green';
        //         this.snackbar = true;
        //         this.load = false;
        //         this.close();
        //         location.reload();
        //         this.readData();
        //         this.resetForm();
        //         this.inputType = 'Tambah';
        //     }).catch(error => {
        //         this.error_message = error.response.data.message;
        //         this.color = "red";
        //         this.snackbar = true;
        //         this.load = false;
        //     });
        // },
        // editHandler(item){
        //     this.inputType = 'Ubah';
        //     this.editId = item.idPegawai;

        //     this.form.namaPgw = item.namaPgw;
        //     this.form.alamatPgw = item.alamatPgw;
        //     this.form.tglLahirPgw = item.tglLahirPgw;
        //     this.form.jenisKelaminPgw = item.jenisKelaminPgw;
        //     this.form.noTelpPgw = item.noTelpPgw;
        //     this.form.urlFotoPgw = item.urlFotoPgw;
        //     this.form.idRole = item.idRole;

        //     this.dialog = true;
        // },
        // deleteHandler(idPegawai){
        //     this.deleteId = idPegawai;
        //     this.dialogDelete = true;
        // },
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
              namaCust: null,
              alamatCust: null,
              tglLahirCust: null,
              jenisKelaminCust: null,
              emailCust: null,
              noTelpCust: null,
              kartuPengenalCust: null,
              simCust: null,
              passwordCust: null,
            };
        },
    },

    computed: {
        formTitle(){
            return this.inputType;
        },
    },
    mounted(){
        // this.readData();
    },
};
</script>