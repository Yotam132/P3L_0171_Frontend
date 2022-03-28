<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 white--text">Promo</h3>
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
            <v-data-table :headers="headers" :items="Promos" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small color="green" class="mr-2" @click="editHandler(item)"> mdi-pencil </v-icon>
                    <v-icon small color="red" @click="deleteHandler(item.id)"> mdi-delete </v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headLine">{{ formTitle }} Promo</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.jenisPromo"
                            label="Nama Promo"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.hargaLayananPromo"
                            label="Harga Layanan"
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
                    text: "Nama Promo",
                    align: "start",
                    sortable: true,
                    value: "jenisPromo",
                },
                { text: "Layanan", value: "hargaLayananPromo" },
               
                { text: "Actions", value: "actions" },
            ],

            Promo: new FormData,
            Promos: [],
            form: {
              jenisPromo: null,
              hargaLayananPromo: null,
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
            var url = this.$api + '/Promo';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.Promos = response.data.data;
            })
        },
        save(){
            this.Promo.append('jenisPromo', this.form.jenisPromo);
            this.Promo.append('hargaLayananPromo', this.form.hargaLayananPromo);


            var url = this.$api + '/Promo'
            this.load = true;
            this.$http.post(url, this.Promo, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                }
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
                jenisPromo: this.form.jenisPromo,
                hargaLayananPromo: this.form.hargaLayananPromo,
            };

            var url = this.$api + '/Promo/' + this.editId;
            this.load = true;
            this.$http.put(url, newData, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
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
            var url = this.$api + '/Promo/' + this.deleteId;
            this.load = true;
            this.$http.delete(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
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
            this.editId = item.id;
            this.form.jenisPromo = item.jenisPromo;
            this.form.hargaLayananPromo = item.hargaLayananPromo;
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
              jenisPromo: null,
              hargaLayananPromo: null, 
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