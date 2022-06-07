<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 font-color-white white--text">Profil</h3>

        <div style="width:940px;overflow-x:auto;">
            <v-card>
                <table>
                    <tr>
                        <th width="180px" height="50px" style="text-align:right;padding-left:8%;">ID</th>
                        <td width="510px" style="text-align:left;padding-left:38%;"> {{ customers.idCustomerGenerated }} </td>
                    </tr>
                    <tr>
                        <th width="180px" height="50px" style="text-align:right;padding-left:8%;">Nama</th>
                        <td width="510px" style="text-align:left;padding-left:38%;"> {{ customers.namaCust }} </td>
                    </tr>
                    <tr> 
                        <th width="180px" height="50px" style="text-align:right;padding-left:8%;">Alamat</th>
                        <td width="510px" style="text-align:left;padding-left:38%;"> {{ customers.alamatCust }} </td>
                    </tr>
                    <tr>
                        <th width="180px" height="50px" style="text-align:right;padding-left:8%;">Tanggal Lahir</th>
                        <td width="510px" style="text-align:left;padding-left:38%;"> {{ customers.tglLahirCust }} </td>
                    </tr>
                    <tr> 
                        <th width="180px" height="50px" style="text-align:right;padding-left:8%;">Jenis Kelamin</th>
                        <td width="510px" style="text-align:left;padding-left:38%;"> {{ customers.jenisKelaminCust }} </td>
                    </tr>
                    <tr>
                        <th width="180px" height="50px" style="text-align:right;padding-left:8%;">No. Telepon</th>
                        <td width="510px" style="text-align:left;padding-left:38%;"> {{ customers.noTelpCust }} </td>
                    </tr>
                    <tr> 
                        <th width="180px" height="50px" style="text-align:right;padding-left:8%;">Email</th>
                        <td width="510px" style="text-align:left;padding-left:38%;"> {{ customers.emailCust }} </td>
                    </tr>
                    <tr>
                        <th width="180px" height="50px" style="text-align:right;padding-left:8%;">Password</th>
                        <td width="510px" style="text-align:left;padding-left:38%;"> {{ customers.passwordCust }} </td>
                    </tr>
                    <tr> 
                        <th width="180px" height="50px" style="text-align:right;padding-left:8%;">Kartu Pengenal</th>
                        <td width="510px" style="text-align:left;padding-left:38%;"> 
                            <img v-bind:src="customers.kartuPengenalCust" alt="" style="width:150px;height:150px;">    
                        </td>
                    </tr>
                    <tr> 
                        <th width="180px" height="50px" style="text-align:right;padding-left:8%;">SIM</th>
                        <td width="510p" style="text-align:left;padding-left:38%;"> 
                            <img v-bind:src="customers.simCust" alt="" style="width:150px;height:150px;">    
                        </td>
                    </tr>
                    <tr>
                        <th width="180px" height="50px" style="text-align:right;padding-left:8%;">Status Verifikasi Dokumen</th>
                        <td width="510px" style="text-align:left;padding-left:38%;"> 
                            <p v-if="customers.statusDokumenCust == 1" style="color:lightgreen">Lolos</p>
                            <p v-else style="color:red">Tidak Lolos</p>
                        </td>
                    </tr>

                    <tr>
                    </tr>
                        <td colspan="2" height="40px" style="padding-bottom:15px;padding-top:30px;">
                            <v-btn color="purple darken-1" text @click="editHandler(customers)"> Edit User </v-btn>
                        </td>
                        <td>
                        </td>
                    <tr>
                    </tr>
                </table>
            </v-card>
        </div>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headLine">{{ formTitle }} Customer</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.namaCust"
                            label="Nama Customer"
                            required
                        ></v-text-field>

                        <!-- Jika Tambah ada ini -->
                        <v-text-field v-if="formTitle !== 'Tambah'"
                            v-model="form.emailCust"
                            label="Email"
                            disabled="true"
                        ></v-text-field>
                        <v-text-field v-if="formTitle !== 'Tambah'"
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
                            <label for="FileFoto" >Kartu Pengenal: </label>
                            <input type="file"
                                id="FileFoto"
                                name="FileFoto"
                                @change="readImage($event, 1)"
                                accept="image/*" 
                                required
                                />
                            <br>
                            <img id="SelectedImg1" v-bind:src="form.kartuPengenalCust" alt="" width="100px" height="100px" style="margin-left:35px;">
                        </div>
                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="FileFoto1" >SIM: </label>
                            <input type="file"
                                id="FileFoto1"
                                name="FileFoto1"
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
                    <v-btn color="purple darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="purple darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- <v-dialog v-model="dialogDelete" max-width="500px">
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
    name: "CstProfil",
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
                    text: "Nama Pegawai",
                    align: "start",
                    sortable: true,
                    value: "namaPgw",
                },
                
                { text: "Foto", value: "urlFotoPgw" },
                { text: "Role", value: "idRole" },
                { text: "Email", value: "emailPgw" },
                { text: "Password", value: "passwordPgw" },
                { text: "Alamat", value: "alamatPgw" },
                { text: "Tanggal Lahir", value: "tglLahirPgw" },
                { text: "Jenis Kelamin", value: "jenisKelaminPgw" },
                { text: "No. Telepon", value: "noTelpPgw" },

                { text: "Actions", value: "actions" },
            ],

            kelamins: [
                { text: "Laki-Laki", value: "L"},
                { text: "Perempuan", value: "P"},
            ],

            customer: new FormData,
            customers: [],

            form: {
              namaCust: null,
              alamatCust: null,
              tglLahirCust: null,
              jenisKelaminCust: null,
              noTelpCust: null,
              emailCust: null,
              passwordCust: null,
              kartuPengenalCust: null,
              simCust: null,

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
            var url = this.$api + '/customer/' + localStorage.getItem("id");
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.customers = response.data.data;
            })
        },
        // save(){
        //     this.customer.append('namaPgw', this.form.namaPgw);
        //     this.customer.append('alamatPgw', this.form.alamatPgw);
        //     this.customer.append('tglLahirPgw', this.form.tglLahirPgw);
        //     this.customer.append('jenisKelaminPgw', this.form.jenisKelaminPgw);
        //     this.customer.append('emailPgw', this.form.emailPgw);
        //     this.customer.append('noTelpPgw', this.form.noTelpPgw);

        //     // url foto diappend ke base64
        //     this.customer.append('idRole', this.form.idRole);


        //     var url = this.$api + '/customer'
        //     this.load = true;
        //     this.$http.post(url, this.customer, {
        //         // headers: {
        //         //     'Authorization' : 'Bearer ' + localStorage.getItem('token'),
        //         // }
        //     }).then(response => {
        //         this.error_message = response.data.message;
        //         this.color = "green";
        //         this.snackbar = true;
        //         this.load = true;
        //         this.close();
        //         this.readData();
        //         this.resetForm();
        //     }).catch(error => {
        //         this.error_message = error.response.data.message;
        //         this.color = "red";
        //         this.snackbar = true;
        //         this.load = false;
        //     });
        // },
        readImage(event, urutan)
        {
            let reader = new FileReader()
            const image = event.target.files[0];
            reader.readAsDataURL(image);

            let rawImg;
            reader.onloadend = () => {
                rawImg = reader.result;
                if(urutan == 1)
                {
                    this.form.kartuPengenalCust = rawImg;
                }
                else
                {
                    this.form.simCust = rawImg;
                }
            }
        },
        update(){
            let newData = {
                namaCust: this.form.namaCust,
                alamatCust: this.form.alamatCust,
                tglLahirCust: this.form.tglLahirCust,
                jenisKelaminCust: this.form.jenisKelaminCust,
                noTelpCust: this.form.noTelpCust,
                passwordCust: this.form.passwordCust,
                kartuPengenalCust: this.form.kartuPengenalCust,
                simCust: this.form.simCust,
            };

            var url = this.$api + '/customer/' + this.editId;
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
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.idCustomer;

            this.form.namaCust = item.namaCust;
            this.form.passwordCust = item.passwordCust;
            this.form.emailCust = item.emailCust;
            this.form.alamatCust = item.alamatCust;
            this.form.tglLahirCust = item.tglLahirCust;
            this.form.jenisKelaminCust = item.jenisKelaminCust;
            this.form.noTelpCust = item.noTelpCust;
            this.form.kartuPengenalCust = item.kartuPengenalCust;
            this.form.simCust = item.simCust;

            this.dialog = true;
        },
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
              noTelpCust: null,
              passwordCust: null,
              emailCust: null,
              kartuPengenalCust: null,
              simCust: null,
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
};
</script>