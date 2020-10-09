import request from '@/utils/request'

//获取采集群
export function GetCollectionGroupList(params) {
    return request.post('/CollectionGroup/List',params)
}
//获取采集日志
export function GetCollectionGroupLogList(params) {
    return request.post('/CollectionGroup/LogList',params)
}


