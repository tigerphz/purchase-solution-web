// 状态
const userStatus = [
  { key: -1, display_name: '删除' },
  { key: 0, display_name: '正常' },
  { key: 1, display_name: '锁定' }
]

// arr to obj
const userStatusValue = userStatus.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const genderEnum = [
  { key: 0, display_name: '女' },
  { key: 1, display_name: '男' }
]

// arr to obj
const userGenderValue = genderEnum.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default
{
  userStatus,
  userStatusValue,
  genderEnum,
  userGenderValue
}
