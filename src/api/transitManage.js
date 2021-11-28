// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

// 轨道交通 数据查询
export const ajaxQueryDataList = (params) => {
    return getRequest('/energyConsumption/getByPage', params)
}

// 交通轨道 年度数据录入查询
export const ajaxQueryYearDataInput = (params) => {
    return postRequest('/energyConsumption/', params)
}

// 交通轨道 年度数据录入
export const ajaxYearDataInput = (params) => {
    return postBodyRequest('/gdjtOperationInfo/insertOrUpdate', params)
}