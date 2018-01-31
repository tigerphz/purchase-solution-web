import store from '@/store'

const hasPermission = (el, perm) => {
  const permissions = store.getters.permissions

  // 如果登录用户没有拥有指定权限则不显示
  if (!permissions.some(permission => perm.indexOf(permission) >= 0)) {
    // 删除自己
    el.parentNode.removeChild(el)
  }
}

export default (Vue) => {
  Vue.directive('has-perm', {
    bind: function(el, binding, vnode) {
      const perm = binding.arg
      hasPermission(el, perm)
    }
  })

  Vue.directive('has-add', {
    bind: function(el, binding, vnode) {
      const perm = binding.arg
      hasPermission(el, `${perm}:add`)
    }
  })

  Vue.directive('has-update', {
    bind: function(el, binding, vnode) {
      const perm = binding.arg
      hasPermission(el, `${perm}:update`)
    }
  })

  Vue.directive('has-delete', {
    bind: function(el, binding, vnode) {
      const perm = binding.arg
      hasPermission(el, `${perm}:delete`)
    }
  })

  Vue.directive('has-view', {
    bind: function(el, binding, vnode) {
      const perm = binding.arg
      hasPermission(el, `${perm}:view`)
    }
  })

  Vue.directive('has-status', {
    bind: function(el, binding, vnode) {
      const perm = binding.arg
      hasPermission(el, `${perm}:status`)
    }
  })
}

