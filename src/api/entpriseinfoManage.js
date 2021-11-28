// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

// 分页获取数据
export const getEnterpriseInfoMangeList = (params) => {
    return getRequest('/enterpriseInfo/getByPage', params)
 }
// 添加
export const addEnterpriseInfoMange = (params) => {
    return postRequest('/enterpriseInfo/insertOrUpdate', params)
}
// 编辑
export const editEnterpriseInfoMange = (params) => {
    return postRequest('/enterpriseInfo/insertOrUpdate', params)
}
// 批量
export const deleteEnterpriseInfoMange = (params) => {
    return postRequest('/enterpriseInfo/delByIds', params)
}