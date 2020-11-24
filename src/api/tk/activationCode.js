import request from '@/api/request/tk'

export function PageList(params) {
    return request.post('/CardCode/List', params)
}