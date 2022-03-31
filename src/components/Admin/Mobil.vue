<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 font-color-white white--text">Mobil</h3>

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
                    <v-btn color="purple" dark @click="cekKontrakHabis" style="margin-right:20px;"> Cek Kontrak Hampir Habis </v-btn>
                    <v-btn color="purple" dark @click="dialog = true"> Tambah </v-btn>
                </v-card-title>
                <v-data-table :headers="headers" :items="mobils" :search="search">
                    <template v-slot:[`item.idMitra`]="{ item }">
                        <div v-for="mitra in mitras" :key="mitra.idMitra">
                            <p v-if="mitra.idMitra === item.idMitra" style="width:100px;">{{ mitra.namaMtr }}</p>
                        </div>
                        <p v-if="item.idMitra === null && item.idMitra <= 0" style="width:100px;">Perusahaan</p>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <td>
                            <tr>
                                <v-icon small color="green" class="mr-2" @click="editHandler(item)"> mdi-pencil </v-icon>
                                <v-icon small color="red" @click="deleteHandler(item.idMobil)"> mdi-delete </v-icon>
                            </tr>
                            <tr>
                                <v-btn x-small color="purple" dark @click="ubahStatus(item.idMobil)" style="margin:5px;"> Ubah Status </v-btn>
                            </tr>
                        </td>
                    </template>
                    <template v-slot:[`item.namaMbl`]="{ item }">
                        <p style="width:90px;">{{item.namaMbl}}</p>
                    </template>
                    <template v-slot:[`item.platNomor`]="{ item }">
                        <p style="width:100px;">{{item.platNomor}}</p>
                    </template>
                    <template v-slot:[`item.periodeKontrakMulai`]="{ item }">
                        <p style="width:100px;">{{item.periodeKontrakMulai}}</p>
                    </template>
                    <template v-slot:[`item.periodeKontrakAkhir`]="{ item }">
                        <p style="width:100px;">{{item.periodeKontrakAkhir}}</p>
                    </template>
                    <template v-slot:[`item.tglServisTerakhir`]="{ item }">
                        <p style="width:100px;">{{item.tglServisTerakhir}}</p>
                    </template>
                    <template v-slot:[`item.urlFotoMbl`]="{ item }">
                        <img style="width:150px;height:150px;" v-bind:src="item.urlFotoMbl" />
                    </template>
                    <template v-slot:[`item.statusMbl`]="{ item }">
                        <p v-if="item.statusMbl === 1" style="color:lightgreen;width:80px;">Siap Pakai</p>
                        <p v-else style="color:red;width:80px;">Tidak Siap Pakai</p>
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headLine">{{ formTitle }} Mobil</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="FileFoto" >Foto: </label>
                            <input type="file"
                                id="FileFoto"
                                name="FileFoto"
                                @change="readImage($event)"
                                accept="image/*" 
                                required
                                />

                            <img id="SelectedImg" v-bind:src="form.urlFotoMbl" alt="" width="100px" height="100px" style="margin-left:-35px;">
                        </div>

                        <v-text-field
                            v-model="form.namaMbl"
                            label="Nama Mobil"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="form.idMitra"
                            :items="mitras"
                            label="Mitra"
                            item-text="namaMtr"
                            item-value="idMitra">
                        </v-select>

                        <v-text-field
                            v-model="form.tipeMbl"
                            label="Tipe Mobil"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.jenisTransmisi"
                            label="Jenis Transmisi"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.jenisBahanBakar"
                            label="Bahan Bakar"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.warna"
                            label="Warna"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.volumeBahanBakar"
                            label="Volume Bahan Bakar"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.kapasitasPenumpang"
                            label="Kapasitas Penumpang"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.fasilitas"
                            label="Fasilitas"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.platNomor"
                            label="Plat Nomor"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.noStnk"
                            label="Nomor STNK"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.hargaSewa"
                            label="Harga Sewa / Hari"
                            required
                        ></v-text-field>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="pkaw" >Periode Kontrak Mulai: </label>
                            <input type="date" 
                                name="pkaw"
                                v-model="form.periodeKontrakMulai"
                                label="Periode Kontrak Awal"
                                required
                            />
                        </div>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="pka" >Periode Kontrak Akhir: </label>
                            <input type="date" 
                                name="pka"
                                v-model="form.periodeKontrakAkhir"
                                label="Periode Kontrak Akhir"
                                required
                            />
                        </div>

                        <div style="text-align:left;font-size:17px;margin-top:3px;margin-bottom:5px;">
                            <label for="tst" >Tanggal Servis Terakhir: </label>
                            <input type="date" 
                                name="tst"
                                v-model="form.tglServisTerakhir"
                                label="Tanggal Servis Terakhir"
                                required
                            />
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

        <v-dialog v-model="dialogKontrak" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Mobil yang kontraknya akan habis dalam 1 bulan</v-card-title>
            <v-card-text>
                <div v-for="mobil in mobils" :key="mobil.idMobil">
                    <p v-if="cekShowMobil(mobil.periodeKontrakAkhir)">{{mobil.namaMbl}}</p>
                </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="purple darken-1" text @click="dialogKontrak = false">Close</v-btn>
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

    name: "AdmMobil",
    data() {
        return {
            inputType: 'Tambah',
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            null_value: null,

            search: null,
            dialog: false,
            dialogDelete: false,
            dialogKontrak: false,
            editedIndex: -1,
            headers: [
                {
                    text: "Nama Mobil",
                    align: "start",
                    sortable: true,
                    value: "namaMbl",
                },
                
                { text: "Kepemilikan", value: "idMitra" },
                { text: "Foto", value: "urlFotoMbl" },
                { text: "Tipe Mobil", value: "tipeMbl" },
                { text: "Jenis Transmisi", value: "jenisTransmisi" },
                { text: "Jenis Bahan Bakar", value: "jenisBahanBakar" },
                { text: "Warna", value: "warna" },
                { text: "Volume Bahan Bakar", value: "volumeBahanBakar" },
                { text: "Kapasitas Penumpang", value: "kapasitasPenumpang" },
                { text: "Fasilitas", value: "fasilitas" },
                { text: "Plat Nomor", value: "platNomor" },
                { text: "No. Stnk", value: "noStnk" },
                { text: "Harga Sewa / Hari", value: "hargaSewa" },
                { text: "Kategori Aset", value: "kategoriAset" },
                { text: "Kontrak Mulai", value: "periodeKontrakMulai" },
                { text: "Kontrak Akhir", value: "periodeKontrakAkhir" },
                { text: "Tanggal Servis Terakhir", value: "tglServisTerakhir" },
                { text: "Status", value: "statusMbl" },

                { text: "Actions", value: "actions" },
            ],

            mobil: new FormData,
            mobils: [],
            mitras: [],

            form: {
              idMitra: null,
              namaMbl: null,
              urlFotoMbl: null,
              tipeMbl: null,
              jenisTransmisi: null,
              jenisBahanBakar: null,
              warna: null,
              volumeBahanBakar: null,
              kapasitasPenumpang: null,
              fasilitas: null,
              platNomor: null,
              noStnk: null,
              hargaSewa: null,
              periodeKontrakMulai: null,
              periodeKontrakAkhir: null,
              tglServisTerakhir: null,
              
            },

            deleteId: null,
            editId: null,
            dateNow: null,
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
            var url = this.$api + '/mobil';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.mobils = response.data.data;
            })
        },
        getMitra(){
             var url = this.$api + '/mitra';
            this.$http.get(url, {
                // headers: {
                //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                // }
            }).then(response => {
                this.mitras = response.data.data;
            })
        },
        save(){
            if(this.form.idMitra > 0)
            {
                this.mobil.append('idMitra', this.form.idMitra);
            }
            else
            {
                this.mobil.append('idMitra', []);
            }
            this.mobil.append('namaMbl', this.form.namaMbl);
            this.mobil.append('tipeMbl', this.form.tipeMbl);
            this.mobil.append('jenisTransmisi', this.form.jenisTransmisi);
            this.mobil.append('jenisBahanBakar', this.form.jenisBahanBakar);
            this.mobil.append('warna', this.form.warna);
            this.mobil.append('volumeBahanBakar', this.form.volumeBahanBakar);
            this.mobil.append('kapasitasPenumpang', this.form.kapasitasPenumpang);
            this.mobil.append('fasilitas', this.form.fasilitas);
            this.mobil.append('platNomor', this.form.platNomor);
            this.mobil.append('noStnk', this.form.noStnk);
            this.mobil.append('hargaSewa', this.form.hargaSewa);
            this.mobil.append('periodeKontrakMulai', this.form.periodeKontrakMulai);
            this.mobil.append('periodeKontrakAkhir', this.form.periodeKontrakAkhir);
            this.mobil.append('tglServisTerakhir', this.form.tglServisTerakhir);

            // url foto diappend ke base64


            var url = this.$api + '/mobil'
            this.load = true;
            this.$http.post(url, this.mobil, {
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
                    this.form.urlFotoMbl = rawImg;
                }
                else
                {
                    this.mobil.append('urlFotoMbl', rawImg);
                    document.getElementById('SelectedImg').src = rawImg;
                }
                // document.getElementById('SelectedImg').src = rawImg;
            }
        },
        ubahStatus(statId){
            var url = this.$api + '/mobilstat/'+ statId;
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
        cekKontrakHabis(){
            this.dialogKontrak = true;
            this.dateNow = moment(String(new Date())).format('YYYY-MM-DD');
        },
        update(){
            let newData = {
                idMitra: this.form.idMitra,
                namaMbl: this.form.namaMbl,
                urlFotoMbl: this.form.urlFotoMbl,
                tipeMbl: this.form.tipeMbl,
                jenisTransmisi: this.form.jenisTransmisi,
                jenisBahanBakar: this.form.jenisBahanBakar,
                warna: this.form.warna,
                volumeBahanBakar: this.form.volumeBahanBakar,
                kapasitasPenumpang: this.form.kapasitasPenumpang,
                fasilitas: this.form.fasilitas,
                platNomor: this.form.platNomor,
                noStnk: this.form.noStnk,
                hargaSewa: this.form.hargaSewa,
                periodeKontrakMulai: this.form.periodeKontrakMulai,
                periodeKontrakAkhir: this.form.periodeKontrakAkhir,
                tglServisTerakhir: this.form.tglServisTerakhir,
                
            };

            var url = this.$api + '/mobil/' + this.editId;
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
            var url = this.$api + '/mobil/' + this.deleteId;
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
            this.editId = item.idMobil;

            this.form.idMitra = item.idMitra;
            this.form.namaMbl = item.namaMbl;
            this.form.urlFotoMbl = item.urlFotoMbl;
            this.form.tipeMbl = item.tipeMbl;
            this.form.jenisTransmisi = item.jenisTransmisi;
            this.form.jenisBahanBakar = item.jenisBahanBakar;
            this.form.warna = item.warna;
            this.form.volumeBahanBakar = item.volumeBahanBakar;
            this.form.kapasitasPenumpang = item.kapasitasPenumpang;
            this.form.fasilitas = item.fasilitas;
            this.form.platNomor = item.platNomor;
            this.form.noStnk = item.noStnk;
            this.form.hargaSewa = item.hargaSewa;
            this.form.periodeKontrakMulai = item.periodeKontrakMulai;
            this.form.periodeKontrakAkhir = item.periodeKontrakAkhir;
            this.form.tglServisTerakhir = item.tglServisTerakhir;

            this.dialog = true;
        },
        deleteHandler(idMobil){
            this.deleteId = idMobil;
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
        cekShowMobil(item)
        {
            if((moment(item).diff(moment(this.dateNow), 'days')) <= 32)
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        resetForm(){
            this.form = {
              idMitra: null,
              namaMbl: null,
              urlFotoMbl: null,
              tipeMbl: null,
              jenisTransmisi: null,
              jenisBahanBakar: null,
              warna: null,
              volumeBahanBakar: null,
              kapasitasPenumpang: null,
              fasilitas: null,
              platNomor: null,
              noStnk: null,
              hargaSewa: null,
              periodeKontrakMulai: null,
              periodeKontrakAkhir: null,
              tglServisTerakhir: null,
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
        this.getMitra();
    },
};
</script>