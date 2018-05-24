import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/logineduser',
    component: Layout,
    hidden: true,
    name: 'logineduser',
    redirect: '/logineduser/index',
    children: [
      { path: 'index', component: _import('manager/logineduser'), name: 'userdetail', meta: { title: 'logineduser' }}
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/manager',
    component: Layout,
    redirect: 'noredirect',
    name: 'manager',
    meta: {
      title: 'manager',
      icon: 'component'
    },
    children: [
      { path: 'list-department', component: _import('manager/department'), name: 'listDepartment', meta: { title: 'listDepartment', icon: 'people', perms: ['department:view'] }},
      { path: 'list-user', component: _import('manager/userlist'), name: 'listUser', meta: { title: 'listUser', icon: 'people', perms: ['user:view'] }},
      { path: 'list-role', component: _import('manager/rolelist'), name: 'listRole', meta: { title: 'listRole', icon: 'peoples', perms: ['role:view'] }},
      { path: 'list-perm', component: _import('manager/permlist'), name: 'listPerm', meta: { title: 'listPerm', icon: 'lock', perms: ['permission:view'] }}
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
