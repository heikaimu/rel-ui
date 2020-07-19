/*
 * @Description:
 * @Version: 2.0
 * @Autor: Yaowen Liu
 * @Date: 2020-03-23 17:40:43
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2020-06-10 11:13:42
 */
import axios from 'axios';
import qs from 'qs';

// axios.defaults.withCredentials = true;

export const login = (params, code) => {
  return new Promise((resolve, reject) => {
    const url = `https://tcback.witemedia.com/api/v1/login?code=${code}`;
    axios({
      method: 'POST',
      url: url,
      data: qs.stringify(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject();
      }
    });
  });
};

