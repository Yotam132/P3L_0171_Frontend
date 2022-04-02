<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 font-color-white white--text">Driver</h3>

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
                <v-data-table :headers="headers" :items="drivers" :search="search">
                    <template v-slot:[`item.actions`]="{ item }">
                        <td>
                            <tr>
                                <v-icon small color="green" class="mr-2" @click="editHandler(item)"> mdi-pencil </v-icon>
                                <v-icon small color="red" @click="deleteHandler(item.idDriver)"> mdi-delete </v-icon>
                            </tr>
                            <tr>
                                <v-btn x-small color="purple" dark @click="ubahStatus(item.idDriver)" style="margin:5px;"> Ubah Status Verifikasi Dokumen </v-btn>
                            </tr>
                        </td>
                    </template>
                    <template v-slot:[`item.tglLahirDrv`]="{ item }">
                        <p style="width:90px;">{{item.tglLahirDrv}}</p>
                    </template>
                    <template v-slot:[`item.alamatDrv`]="{ item }">
                        <p style="width:120px;">{{item.alamatDrv}}</p>
                    </template>
                    <template v-slot:[`item.bahasaAsing`]="{ item }">
                        <p v-if="item.bahasaAsing === 1">Ya</p>
                        <p v-if="item.bahasaAsing === 0">Tidak</p>
                    </template>
                    <template v-slot:[`item.statusDrv`]="{ item }">
                        <p v-if="item.statusDrv === 1" style="color:lightgreen">Tersedia</p>
                        <p v-else style="color:red">Tidak Tersedia</p>
                    </template>
                    <template v-slot:[`item.statusDokumenDrv`]="{ item }">
                        <p v-if="item.statusDokumenDrv === 1" style="color:lightgreen">Lolos</p>
                        <p v-else style="color:red">Tidak Lolos</p>
                    </template>
                    <template v-slot:[`item.idDriverGenerated`]="{ item }">
                        <p style="width:120px;">{{item.idDriverGenerated}}</p>
                    </template>
                    <template v-slot:[`item.urlFotoDrv`]="{ item }">
                        <img style="width:150px;height:150px;" v-bind:src="item.urlFotoDrv" />
                    </template>
                    <template v-slot:[`item.simDrv`]="{ item }">
                        <img style="width:150px;height:150px;" v-bind:src="item.simDrv" />
                    </template>
                    <template v-slot:[`item.suratBebasNapzaDrv`]="{ item }">
                        <img style="width:150px;height:150px;" v-bind:src="item.suratBebasNapzaDrv" />
                    </template>
                    <template v-slot:[`item.suratKesehatanJiwaDrv`]="{ item }">
                        <img style="width:150px;height:150px;" v-bind:src="item.suratKesehatanJiwaDrv" />
                    </template>
                    <template v-slot:[`item.suratKesehatanJasmaniDrv`]="{ item }">
                        <img style="width:150px;height:150px;" v-bind:src="item.suratKesehatanJasmaniDrv" />
                    </template>
                    <template v-slot:[`item.skckDrv`]="{ item }">
                        <img style="width:150px;height:150px;" v-bind:src="item.skckDrv" />
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headLine">{{ formTitle }} Driver</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-if="formTitle === 'Tambah'"
                            v-model="form.namaDrv"
                            label="Nama Driver"
                            required
                        ></v-text-field>

                        <!-- Jika Tambah ada ini -->
                        <v-text-field v-if="formTitle === 'Tambah'"
                            v-model="form.emailDrv"
                            label="Email"
                            required
                        ></v-text-field>

                        <v-select v-if="formTitle === 'Tambah'"
                            v-model="form.jenisKelaminDrv"
                            :items="kelamins"
                            label="Jenis Kelamin"
                            required
                        ></v-select>

                        <v-text-field v-if="formTitle === 'Tambah'"
                            v-model="form.alamatDrv"
                            label="Alamat"
                            required
                        ></v-text-field>

                        <div v-if="formTitle === 'Tambah'" style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="tgLh" >Tanggal Lahir: </label>
                            <input type="date" 
                                name="tgLh"
                                v-model="form.tglLahirDrv"
                                label="Tanggal Lahir"
                                required
                            />
                        </div>

                        <v-text-field v-if="formTitle === 'Tambah'"
                            v-model="form.noTelpDrv"
                            label="No. Telepon"
                            required
                        ></v-text-field>

                        <v-select v-if="formTitle === 'Tambah'"
                            v-model="form.bahasaAsing"
                            :items="bahasaasings"
                            label="Berbahasa Asing"
                            required
                        ></v-select>

                        <v-text-field v-if="formTitle === 'Tambah'"
                            v-model="form.tarifDrv"
                            label="Tarif Harian"
                            required
                        ></v-text-field>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="FileFoto" >Foto: </label>
                            <input type="file"
                                id="FileFoto"
                                name="FileFoto"
                                @change="readImage($event, 1)"
                                accept="image/*" 
                                required/>

                            <img id="SelectedImg1" v-bind:src="form.urlFotoDrv" alt="" width="100px" height="100px" style="margin-left:-35px;">
                        </div>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="FileSIM" >SIM: </label>
                            <input type="file"
                                id="FileSIM"
                                name="FileSIM"
                                @change="readImage($event, 2)"
                                accept="image/*" 
                                required/>

                            <img id="SelectedImg2" v-bind:src="form.simDrv" alt="" width="100px" height="100px" style="margin-left:35px;">
                        </div>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="FileNapza" >Surat Bebas Napza: </label>
                            <input type="file"
                                id="FileNapza"
                                name="FileNapza"
                                @change="readImage($event, 3)"
                                accept="image/*" 
                                required/>
                                <br>
                            <img id="SelectedImg3" v-bind:src="form.suratBebasNapzaDrv" alt="" width="100px" height="100px" style="margin-left:35px;">
                        </div>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="FileJiwa" >Surat Kesehatan Jiwa: </label>
                            <input type="file"
                                id="FileJiwa"
                                name="FileJiwa"
                                @change="readImage($event, 4)"
                                accept="image/*" 
                                required/>
                                <br>
                            <img id="SelectedImg4" v-bind:src="form.suratKesehatanJiwaDrv" alt="" width="100px" height="100px" style="margin-left:35px;">
                        </div>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="FileJasmani" >Surat Kesehatan Jasmani: </label>
                            <input type="file"
                                id="FileJasmani"
                                name="FileJasmani"
                                @change="readImage($event, 5)"
                                accept="image/*" 
                                required/>
                                <br>
                            <img id="SelectedImg5" v-bind:src="form.suratKesehatanJasmaniDrv" alt="" width="100px" height="100px" style="margin-left:35px;">
                        </div>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="FileSKCK" >SKCK: </label>
                            <input type="file"
                                id="FileSKCK"
                                name="FileSKCK"
                                @change="readImage($event, 6)"
                                accept="image/*" 
                                required/>
                                <br>
                            <img id="SelectedImg6" v-bind:src="form.skckDrv" alt="" width="100px" height="100px" style="margin-left:35px;">
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
    name: "AdmDriver",
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
                    text: "ID Driver",
                    align: "start",
                    sortable: true,
                    value: "idDriverGenerated",
                },
                
                { text: "Foto", value: "urlFotoDrv" },
                { text: "Nama", value: "namaDrv" },
                { text: "Email", value: "emailDrv" },
                { text: "Password", value: "passwordDrv" },
                { text: "Alamat", value: "alamatDrv" },
                { text: "Tanggal Lahir", value: "tglLahirDrv" },
                { text: "Jenis Kelamin", value: "jenisKelaminDrv" },
                { text: "No. Telepon", value: "noTelpDrv" },
                { text: "Berbahasa Asing", value: "bahasaAsing" },
                { text: "Tarif Harian", value: "tarifDrv" },

                { text: "SIM", value: "simDrv" },
                { text: "Surat Bebas Napza", value: "suratBebasNapzaDrv" },
                { text: "Surat Kesehatan Jiwa", value: "suratKesehatanJiwaDrv" },
                { text: "Surat Kesehatan Jasmani", value: "suratKesehatanJasmaniDrv" },
                { text: "SKCK", value: "skckDrv" },

                { text: "Rerata Rating", value: "rerataRatingDrv" },
                { text: "Ketersediaan", value: "statusDrv" },
                { text: "Status Dokumen", value: "statusDokumenDrv" },

                { text: "Actions", value: "actions" },
            ],

            kelamins: [
                { text: "Laki-Laki", value: "L"},
                { text: "Perempuan", value: "P"},
            ],
            bahasaasings: [
                { text: "Ya", value: "1"},
                { text: "Tidak", value: "0"},
            ],

            driver: new FormData,
            drivers: [],

            form: {
              namaDrv: null,
              alamatDrv: null,
              tglLahirDrv: null,
              jenisKelaminDrv: null,
              emailDrv: null,
              passwordDrv: null,
              noTelpDrv: null,
              bahasaAsing: null,
              urlFotoDrv: null,
              statusDrv: null,
              simDrv: null,
              tarifDrv: null,
              suratBebasNapzaDrv: null,
              suratKesehatanJiwaDrv: null,
              suratKesehatanJasmaniDrv: null,
              skckDrv: null,
              
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
            var url = this.$api + '/driver';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.drivers = response.data.data;
            })
        },
        save(){
            this.driver.append('namaDrv', this.form.namaDrv);
            this.driver.append('alamatDrv', this.form.alamatDrv);
            this.driver.append('tglLahirDrv', this.form.tglLahirDrv);
            this.driver.append('jenisKelaminDrv', this.form.jenisKelaminDrv);
            this.driver.append('emailDrv', this.form.emailDrv);
            this.driver.append('noTelpDrv', this.form.noTelpDrv);
            this.driver.append('bahasaAsing', this.form.bahasaAsing);
            this.driver.append('tarifDrv', this.form.tarifDrv);            

            // url foto diappend ke base64

            var url = this.$api + '/driver'
            this.load = true;
            this.$http.post(url, this.driver, {
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
        readImage(event, urutan)
        {
            let reader = new FileReader()
            const image = event.target.files[0];
            reader.readAsDataURL(image);

            let rawImg;
            reader.onloadend = () => {
                rawImg = reader.result;
                if(this.inputType !== 'Tambah')
                {
                    if(urutan === 1)
                    {
                        this.form.urlFotoDrv = rawImg;
                    }
                    else if(urutan === 2)
                    {
                        this.form.simDrv = rawImg;
                    }
                    else if(urutan === 3)
                    {
                        this.form.suratBebasNapzaDrv = rawImg;
                    }
                    else if(urutan === 4)
                    {
                        this.form.suratKesehatanJiwaDrv = rawImg;
                    }
                    else if(urutan === 5)
                    {
                        this.form.suratKesehatanJasmaniDrv = rawImg;
                    }
                    else if(urutan === 6)
                    {
                        this.form.skckDrv = rawImg;
                    }
                }
                else
                {
                    if(urutan === 1)
                    {
                        this.driver.append('urlFotoDrv', rawImg);
                        document.getElementById('SelectedImg1').src = rawImg;
                    }
                    else if(urutan === 2)
                    {
                        this.driver.append('simDrv', rawImg);
                        document.getElementById('SelectedImg2').src = rawImg;
                    }
                    else if(urutan === 3)
                    {
                        this.driver.append('suratBebasNapzaDrv', rawImg);
                        document.getElementById('SelectedImg3').src = rawImg;
                    }
                    else if(urutan === 4)
                    {
                        this.driver.append('suratKesehatanJiwaDrv', rawImg);
                        document.getElementById('SelectedImg4').src = rawImg;
                    }
                    else if(urutan === 5)
                    {
                        this.driver.append('suratKesehatanJasmaniDrv', rawImg);
                        document.getElementById('SelectedImg5').src = rawImg;
                    }
                    else if(urutan === 6)
                    {
                        this.driver.append('skckDrv', rawImg);
                        document.getElementById('SelectedImg6').src = rawImg;
                    }
                }
            }
        },
        update(){
            let newData = {
                namaDrv: this.form.namaDrv,
                alamatDrv: this.form.alamatDrv,
                tglLahirDrv: this.form.tglLahirDrv,
                jenisKelaminDrv: this.form.jenisKelaminDrv,
                noTelpDrv: this.form.noTelpDrv,
                bahasaAsing: this.form.bahasaAsing,
                urlFotoDrv: this.form.urlFotoDrv,
                simDrv: this.form.simDrv,
                tarifDrv: this.form.tarifDrv,
                suratBebasNapzaDrv: this.form.suratBebasNapzaDrv,
                suratKesehatanJiwaDrv: this.form.suratKesehatanJiwaDrv,
                suratKesehatanJasmaniDrv: this.form.suratKesehatanJasmaniDrv,
                skckDrv: this.form.skckDrv,
                passwordDrv: this.form.passwordDrv,
            };

            var url = this.$api + '/driver/' + this.editId;
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
            var url = this.$api + '/driver/' + this.deleteId;
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
        ubahStatus(statId){
            var url = this.$api + '/driverstatdokumen/'+ statId;
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
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.idDriver;

            this.form.namaDrv = item.namaDrv;
            this.form.alamatDrv = item.alamatDrv;
            this.form.tglLahirDrv = item.tglLahirDrv;
            this.form.jenisKelaminDrv = item.jenisKelaminDrv;
            this.form.noTelpDrv = item.noTelpDrv;
            this.form.bahasaAsing = item.bahasaAsing;
            this.form.tarifDrv = item.tarifDrv;
            this.form.urlFotoDrv = item.urlFotoDrv;
            this.form.simDrv = item.simDrv;
            this.form.suratBebasNapzaDrv = item.suratBebasNapzaDrv;
            this.form.suratKesehatanJiwaDrv = item.suratKesehatanJiwaDrv;
            this.form.suratKesehatanJasmaniDrv = item.suratKesehatanJasmaniDrv;
            this.form.skckDrv = item.skckDrv;
            this.form.passwordDrv = item.passwordDrv;

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
              namaDrv: null,
              alamatDrv: null,
              tglLahirDrv: null,
              jenisKelaminDrv: null,
              emailDrv: null,
              passwordDrv: null,
              noTelpDrv: null,
              bahasaAsing: null,
              urlFotoDrv: null,
              statusDrv: null,
              simDrv: null,
              tarifDrv: null,
              suratBebasNapzaDrv: null,
              suratKesehatanJiwaDrv: null,
              suratKesehatanJasmaniDrv: null,
              skckDrv: null,
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