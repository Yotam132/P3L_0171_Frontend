<template>
    <div class="dashboard">
        <v-navigation-drawer class="fullheight" width="256" permanent app fixed>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">AJR</v-list-item-title>
                    <v-list-item-subtitle> JASA SEWA NO.1 </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list dense nav v-if="whatRole === 1">
                <v-list-item
                    v-for="item in itemsCustomer"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-list dense nav v-else-if="whatRole === 2">
                <v-list-item
                    v-for="item in itemsManager"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-list dense nav v-else-if="whatRole === 3">
                <v-list-item
                    v-for="item in itemsCS"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-list dense nav v-else-if="whatRole === 4">
                <v-list-item
                    v-for="item in itemsAdmin"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-list dense nav v-else>
                <v-list-item
                    v-for="item in itemsUmum"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            


        </v-navigation-drawer>

        <v-app-bar app fixed height="75px">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-spacer/>
            <v-toolbar-items>
                <v-btn text router @click="logout"><v-icon>mdi-power</v-icon></v-btn>
            </v-toolbar-items>
        </v-app-bar>

        <div class="purple fullheight pa-5">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

export default {
    name: "DashboardLayout",
    data(){
        return {
            drawer: true,

            itemsUmum: [
                { title: "Daftar Customer", to: "/daftarcust"},
                { title: "Login", to: "/login"},
            ],

            itemsManager: [
                { title: "Detail Jadwal", to: "/detailjdw"},
                { title: "Jadwal", to: "/jadwal"},
                { title: "Promo", to: "/promo"},
                { title: "Role", to: "/role"},
            ],

            itemsAdmin: [
                { title: "Driver", to: "/driver"},
                { title: "Mitra", to: "/mitra"},
                { title: "Mobil", to: "/mobil"},
                { title: "Pegawai", to: "/pegawai"},
            ],

            itemsCS: [
                { title: "Data Customer", to: "/customercs"},
                { title: "Data Transaksi", to: "/transaksics"},
                // { title: "Promo", to: "/promo"},
                // { title: "Role", to: "/role"},
            ],

            itemsCustomer: [
                { title: "Profil Customer", to: "/profilcustomer"},
                { title: "Transaksi", to: "/transaksi"},
                // { title: "Promo", to: "/promo"},
                // { title: "Role", to: "/role"},
            ],
        };
    },
    methods: {
        logout(){
            localStorage.clear();
            this.$router.push({
                name: 'Home',
            });
            location.reload();
        },
    },
    computed: {
        whatRole(){
            /**
             * Customer == 1
             * Manager == 2
             * CS == 3
             * Admin == 4
             * 
            */

            if(localStorage.getItem("role") == "customer")
            {
                return 1;
            }
            else if(localStorage.getItem("role") == "Manager")
            {
                return 2;
            }
            else if(localStorage.getItem("role") == "CS")
            {
                return 3;
            }
            else if(localStorage.getItem("role") == "Admin")
            {
                return 4;
            }
            else
            {
                return 0;
            }
        },
    },
};
</script>

<style scoped>
.fullheight{
    min-height: 100vh !important;
}

.router{
    text-decoration: none;
    color: black;
}
</style>
