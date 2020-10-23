import request from './index'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const token = Cookie.get('TokenUserCk')
request.defaults.headers.common[ACCESS_TOKEN] = 'Bearer ' + token;

export default request