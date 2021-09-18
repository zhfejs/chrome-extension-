/*
 * @Description: 
 * @Autor: zhenghui
 * @Date: 2021-09-18 10:48:26
 */

import axios from "axios";

// 获取系统列表
export const getSystemMapList = ()=>{
  return axios.request({
    method: 'get',
    url: 'http://192.168.17.206/zhenghui/sys.json'
  });
}
