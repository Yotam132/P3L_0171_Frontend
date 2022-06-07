<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 font-color-white white--text">Pegawai</h3>

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
                <v-data-table :headers="headers" :items="pegawais" :search="search">
                    <template v-slot:[`item.idRole`]="{ item }">
                        <div v-for="role in roles" :key="role.idRole">
                            <p v-if="role.idRole == item.idRole">{{ role.namaRole }}</p>
                        </div>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small color="green" class="mr-2" @click="editHandler(item)"> mdi-pencil </v-icon>
                        <v-icon small color="red" @click="deleteHandler(item.idPegawai)"> mdi-delete </v-icon>
                    </template>
                    <template v-slot:[`item.tglLahirPgw`]="{ item }">
                        <p style="width:90px;">{{item.tglLahirPgw}}</p>
                    </template>
                    <template v-slot:[`item.alamatPgw`]="{ item }">
                        <p style="width:120px;">{{item.alamatPgw}}</p>
                    </template>
                    <template v-slot:[`item.urlFotoPgw`]="{ item }">
                        <img style="width:150px;height:150px;" v-bind:src="item.urlFotoPgw" />
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headLine">{{ formTitle }} Pegawai</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.namaPgw"
                            label="Nama Pegawai"
                            required
                        ></v-text-field>

                        <!-- Jika Tambah ada ini -->
                        <v-text-field v-if="formTitle == 'Tambah'"
                            v-model="form.emailPgw"
                            label="Email"
                            required
                        ></v-text-field>
                        <v-text-field v-if="formTitle !== 'Tambah'"
                            v-model="form.passwordPgw"
                            label="Password"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="form.jenisKelaminPgw"
                            :items="kelamins"
                            label="Jenis Kelamin"
                            required
                        ></v-select>

                        <v-text-field
                            v-model="form.alamatPgw"
                            label="Alamat"
                            required
                        ></v-text-field>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="tgLh" >Tanggal Lahir: </label>
                            <input type="date" 
                                name="tgLh"
                                v-model="form.tglLahirPgw"
                                label="Tanggal Lahir"
                                required
                            />
                        </div>

                        <v-text-field
                            v-model="form.noTelpPgw"
                            label="No. Telepon"
                            required
                        ></v-text-field>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="FileFoto" >Foto: </label>
                            <input type="file"
                                id="FileFoto"
                                name="FileFoto"
                                @change="readImage($event)"
                                accept="image/*" 
                                required
                                />

                            <img id="SelectedImg" v-bind:src="form.urlFotoPgw" alt="" width="100px" height="100px" style="margin-left:-35px;">
                        </div>

                        <v-select
                            v-model="form.idRole"
                            :items="roles"
                            item-text="namaRole"
                            item-value="idRole"
                            label="Role"
                            required
                        ></v-select>


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

            pegawai: new FormData,
            pegawais: [],
            roles: [],

            form: {
              namaPgw: null,
              alamatPgw: null,
              tglLahirPgw: null,
              jenisKelaminPgw: null,
              emailPgw: null,
              noTelpPgw: null,
              urlFotoPgw: null,
              idRole: null,
              passwordPgw: null,
              
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
            var url = this.$api + '/pegawai';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.pegawais = response.data.data;
            })
        },
        getRole(){
             var url = this.$api + '/role';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.roles = response.data.data;
            })
        },
        save(){
            this.pegawai.append('namaPgw', this.form.namaPgw);
            this.pegawai.append('alamatPgw', this.form.alamatPgw);
            this.pegawai.append('tglLahirPgw', this.form.tglLahirPgw);
            this.pegawai.append('jenisKelaminPgw', this.form.jenisKelaminPgw);
            this.pegawai.append('emailPgw', this.form.emailPgw);
            this.pegawai.append('noTelpPgw', this.form.noTelpPgw);

            // url foto diappend ke base64
            this.pegawai.append('idRole', this.form.idRole);


            var url = this.$api + '/pegawai'
            this.load = true;
            this.$http.post(url, this.pegawai, {
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
        readImage(event)
        {
            let reader = new FileReader()
            const image = event.target.files[0];
            reader.readAsDataURL(image);

            let rawImg;
            reader.onloadend = () => {
                rawImg = reader.result;
                if(this.inputType !== 'Tambah')
                {
                    this.form.urlFotoPgw = rawImg;
                }
                else
                {
                    this.pegawai.append('urlFotoPgw', rawImg);
                    document.getElementById('SelectedImg').src = rawImg;
                }
            }
        },
        update(){
            let newData = {
                namaPgw: this.form.namaPgw,
                alamatPgw: this.form.alamatPgw,
                tglLahirPgw: this.form.tglLahirPgw,
                jenisKelaminPgw: this.form.jenisKelaminPgw,
                noTelpPgw: this.form.noTelpPgw,
                urlFotoPgw: this.form.urlFotoPgw,
                passwordPgw: this.form.passwordPgw,
                idRole: this.form.idRole,
            };

            var url = this.$api + '/pegawai/' + this.editId;
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
            var url = this.$api + '/pegawai/' + this.deleteId;
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
            this.editId = item.idPegawai;

            this.form.namaPgw = item.namaPgw;
            this.form.passwordPgw = item.passwordPgw;
            this.form.alamatPgw = item.alamatPgw;
            this.form.tglLahirPgw = item.tglLahirPgw;
            this.form.jenisKelaminPgw = item.jenisKelaminPgw;
            this.form.noTelpPgw = item.noTelpPgw;
            this.form.urlFotoPgw = item.urlFotoPgw;
            this.form.idRole = item.idRole;

            this.dialog = true;
        },
        deleteHandler(idPegawai){
            this.deleteId = idPegawai;
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
              namaPgw: null,
              alamatPgw: null,
              tglLahirPgw: null,
              jenisKelaminPgw: null,
              emailPgw: null,
              noTelpPgw: null,
              urlFotoPgw: null,
              idRole: null,
              passwordPgw: null,
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
        this.getRole();
    },
};
</script>