import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/permissions/tree',
    method: 'post',
    params: query
  })
}

export function createPerm(data) {
  return request({
    url: '/permissions/add',
    method: 'post',
    data
  })
}

export function updatePerm(data) {
  return request({
    url: '/permissions/update',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/permissions/status',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: data
  })
}

export function menuNode() {
  return request({ url: '/permissions/menunode',
    method: 'get'
  })
}

export function getRolePerms(roleId) {
  return request({
    url: '/permissions/getRolePerms',
    method: 'get',
    params: { roleId }
  })
}

export function getAllPerms() {
  return request({
    url: '/permissions/allPerms',
    mounted: 'get'
  })
}

export function updateRolePerms(data) {
  return request({
    url: '/permissions/updateRolePerms',
    method: 'post',
    data
  })
}

export function flashPerms() {
  return request({
    url: '/permissions/flashPerms',
    method: 'get'
  })
}
