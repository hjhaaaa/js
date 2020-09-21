import request from '@/utils/request'

// 组团淘客根进
export function getList(params) {
    return request.get('/d/TkFollow/GetRecords', { params })
}
// 承接人指派
export function setAssign(params) {
    return request.post('/d/TkFollow/Assign', params)
}

// 获取记录
export function getLog(params) {
    return request.get('/d/TkFollow/GetRecordLog', { params })
}

// 修改跟进记录
export function updateRecord(params) {
    return request.post('/d/TkFollow/RecordChange', params)
}

// 获取淘客跟进详情
export function getRecordItem(params) {
    return request.get('/d/TkFollow/GetRecordByTkId', { params })
}

export function getHeadList(params) {
    return request.get('/d/TkFollow/headlist', { params });
}