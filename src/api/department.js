import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/departments/list',
    method: 'post',
    params: query
  })
}

export function createDepartment(data) {
  return request({
    url: '/departments/add',
    method: 'post',
    data
  })
}

export function updateDepartment(data) {
  return request({
    url: '/departments/update',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/departments/status',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: data
  })
}
