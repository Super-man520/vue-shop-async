import Vue from 'vue'
import VueRouter from 'vue-router'

// 解除打印错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 按需加载
const Login = () => import(/* webpackChunkName: 'index' */'../components/Login.vue')
const Index = () => import(/* webpackChunkName: 'index' */'../components/Index.vue')
const Users = () => import(/* webpackChunkName: 'users' */'../components/users/Users.vue')
const Roles = () => import(/* webpackChunkName: 'roles' */'../components/roles/Roles.vue')
const Rights = () => import(/* webpackChunkName: 'roles' */'../components/roles/Rights.vue')
const Goods = () => import(/* webpackChunkName: 'product' */'../components/products/Goods.vue')
const Params = () => import(/* webpackChunkName: 'product' */'../components/products/Params.vue')
const Categories = () => import(/* webpackChunkName: 'product' */'../components/products/Categories.vue')
const GoodsAdd = () => import(/* webpackChunkName: 'product' */'../components/products/GoodsAdd.vue')
const Reports = () => import(/* webpackChunkName: 'reports' */'../components/reports/Reports.vue')
const Orders = () => import(/* webpackChunkName: 'orders' */'../components/orders/Orders.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/login', name: 'login', component: Login },
  { path: '/index',
    name: 'index',
    component: Index,
    children: [
      { path: '/users', name: 'users', component: Users },
      { path: '/roles', name: 'roles', component: Roles },
      { path: '/rights', name: 'rights', component: Rights },
      { path: '/goods', name: 'goods', component: Goods },
      { path: '/params', name: 'params', component: Params },
      { path: '/categories', name: 'categories', component: Categories },
      { path: '/goods-add', name: 'goods-add', component: GoodsAdd },
      { path: '/reports', name: 'reports', component: Reports },
      { path: '/orders', name: 'orders', component: Orders }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 导航守卫
router.beforeEach((to, from, next) => {
  const $token = localStorage.getItem('token')
  if (to.path === '/login' || $token) {
    next()
  } else {
    next('/login')
  }
})

export default router
