<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 font-color-white white--text">LOGIN</h3>

        <!-- <v-dialog max-width="600px"> -->
            <v-card>
                <v-card-title>
                    <span class="headLine"></span>
                </v-card-title>
                <v-card-text>
                    <v-container>

                        <!-- Jika Tambah ada ini -->
                        <v-select
                            v-model="form.no"
                            :items="sebagais"
                            item-text="text"
                            item-value="value"
                            label="Masuk Sebagai"
                            required
                        ></v-select>

                        <v-text-field v-if="formTitle === 'Tambah'"
                            v-model="form.email"
                            label="Email"
                            required
                        ></v-text-field>

                        <v-text-field v-if="formTitle === 'Tambah'"
                            v-model="form.password"
                            label="Password"
                            required
                        ></v-text-field>

                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="purple darken-1" text @click="setForm"> Masuk </v-btn>
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

            sebagais: [
                { text: "Customer", value: "1"},
                { text: "Pegawai", value: "2"}
            ],

            customer: new FormData,
            pegawais: [],
            roles: [],

            form: {
              email: null,
              password: null,
              no: null,
              
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
            this.customer.append('email', this.form.email);
            this.customer.append('password', this.form.password);
            this.customer.append('no', this.form.no);
            var numba = this.form.no;

            // url foto diappend ke base64


            var url = this.$api + '/login'
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

                var userLogin = response.data.data;

                if(numba == 1)
                { // Customer
                    localStorage.setItem('id', userLogin['idCustomer']);
                    localStorage.setItem('role', 'customer');

                    this.$router.push({
                        name: 'Profil Customer',
                    });
                    location.reload();
                }
                else if(numba == 2)
                { // Pegawai
                    /**
                     * Role 1 - Manager
                     * Role 2 - CS
                     * Role 3 - Admin
                    */
                   localStorage.setItem('id', userLogin['idPegawai']);

                    if(userLogin['idRole'] === 1)
                    {
                        localStorage.setItem('role', 'Manager');

                        this.$router.push({
                            name: 'Jadwal',
                        });
                        location.reload();
                    }
                    else if(userLogin['idRole'] === 2)
                    {
                        localStorage.setItem('role', 'CS');

                        this.$router.push({
                            name: 'Customer CS',
                        });
                        location.reload();
                    }
                    else if(userLogin['idRole'] === 3)
                    {
                        localStorage.setItem('role', 'Admin');

                        this.$router.push({
                            name: 'Driver',
                        });
                        location.reload();
                    }
                }

            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
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
              email: null,
              password: null,
              no: null,
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