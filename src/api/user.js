import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/users/list',
    method: 'post',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/users/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/users/update',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/users/status',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: data
  })
}

export function updatePassword(data) {
  return request({
    url: '/users/password',
    method: 'post',
    data
  })
}

export function getUserById(userId) {
  return request({
    url: '/users/info',
    method: 'get',
    params: { userId }
  })
}

export function updateUserById(data) {
  return request({
    url: '/users/user',
    method: 'post',
    data
  })
}
