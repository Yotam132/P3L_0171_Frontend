import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

function importComponent(path){
  return () => import(`./components/${path}.vue`);
}

const routes = [
  {
      path: "/",
      name: "admin",
    //   meta: {requiresAuth: true},
      component: importComponent("DashboardLayout"),
      //import component diatas ini jadi halaman yg diaksess pertama kali, tadinya DashboardLayout
      children: [
          // MANAGER SITE
          {
              path: '/promo',
              name: 'Promo',
              meta: {title: 'Promo'},
              component: importComponent("Manager/Promo"),

          },
          {
              path: '/jadwal',
              name: 'Jadwal',
              meta: {title: 'Jadwal'},
              component: importComponent("Manager/Jadwal"),
          },
          {
              path: '/role',
              name: 'Role',
              meta: {title: 'Role'},
              component: importComponent("Manager/Role"),
          },
          {
              path: '/detailjdw',
              name: 'Detail Jadwal',
              meta: {title: 'Detail Jadwal'},
              component: importComponent("Manager/DetailJdw"),
          },

          // ADMIN SITE
          {
              path: '/mitra',
              name: 'Mitra',
              meta: {title: 'Mitra'},
              component: importComponent("Admin/Mitra"),

          },
          {
              path: '/pegawai',
              name: 'Pegawai',
              meta: {title: 'Pegawai'},
              component: importComponent("Admin/Pegawai"),

          },
          {
              path: '/mobil',
              name: 'Mobil',
              meta: {title: 'Mobil'},
              component: importComponent("Admin/Mobil"),
          },
          {
              path: '/driver',
              name: 'Driver',
              meta: {title: 'Driver'},
              component: importComponent("Admin/Driver"),
          },


          //CUSTOMER SERVICE PAGE
          {
              path: "/adminKurir",
              name: "Kurir",
              meta: {title: 'Kurir'},
              component: importComponent('Admin/Kurir'),
          },

          {
              path: "/adminPaket",
              name: "Paket",
              meta: {title: 'Paket'},
              component: importComponent('Admin/Paket'),
          },
      ],
  },

  //login
  {
      path: '/home',
      name: 'home',
      meta: {title: 'Home'},
      component: importComponent('DashboardLayout'),
      children: [
          {
              path: '/daftarCust',
              name: 'Pendaftaran',
              meta: {title: 'Pendaftaran'},
              component: importComponent('Customer/Pendaftaran'),
          },
      ]
  },
  {
      path: '/home',
      name: 'Home',
      meta: {title: 'Home'},
      component: importComponent('DashboardLayout'),
  },
  {
      path: '*',
      redirect: '/'
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  if(to.matched.some(record => record.meta.requiresAuth))
  {
      if(localStorage.getItem('token') == null)
      {
          next({name: 'Home'});
      }
      else
      {
          next();
      }
  }
  else
  {
      next();
  }
});

export default router
