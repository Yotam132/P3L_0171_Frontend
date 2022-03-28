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
      // meta: {requiresAuth: true},
      component: importComponent("DashboardLayout"),
      //import component diatas ini jadi halaman yg diaksess pertama kali, tadinya DashboardLayout
      children: [
          {
              path: '/promo',
              name: 'Promo',
              meta: {title: 'Promo'},
              component: importComponent("Manager/Promo"),

          },
          {
              path: '/pesanan',
              name: 'Pemesanan',
              meta: {title: 'Pemesanan'},
              component: importComponent("Normals/Pesanan"),

          },
          {
              path: '/profile',
              name: 'Profile',
              meta: {title: 'Profile'},
              component: importComponent("Normals/Profile"),

          },


          //ADMIN PAGE
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
