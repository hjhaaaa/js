import request from './index'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const token = Cookie.get('TokenAdminCk')
request.defaults.headers.common[ACCESS_TOKEN] = 'Bearer ' + token;

export default request