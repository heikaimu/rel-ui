/*
 * @Description: Axios配置
 * @Version: 2.0
 * @Autor: Yaowen Liu
 * @Date: 2020-04-20 14:43:12
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2020-06-12 18:47:44
 */
import axios from 'axios';
import {
  Loading,
  Message,
  MessageBox
} from 'element-ui';
import LocalService from '@/common/service/localService';

let isAlert = true;

export const requestWidthoutLoading = createBaseInstance();
// 带有loading的请求实例
export const request = createBaseInstance();
mixinLoading(request.interceptors);

function createBaseInstance() {
  axios.defaults.withCredentials = true;
  const instance = axios.create({
    timeout: 1000 * 60 * 30
  });

  instance.interceptors.request.use(setToken);
  instance.interceptors.response.use(handleResponse, handleError);
  return instance;
}

function handleError(e) {
  throw e;
}

function handleResponse(response) {
  if (response.status === 200) {
    const resStatus = response.data.status;

    if (resStatus === '0') {
      return response.data;
    } else if (resStatus === '401') {
      if (isAlert) {
        MessageBox.alert('你的登陆已经过期，请先登录后继续操作！', '登陆过期', {
          confirmButtonText: '确定',
          showClose: false,
          callback: () => {
            isAlert = true;
            logout();
          }
        });
        isAlert = false;
      }
    } else if (resStatus === '1000') {
      error1000(response.data);
    } else {
      Message.error(response.data.message);
      return response.data;
    }
  } else {
    errorHandling(response.status);
  }
}

// 添加token
function setToken(config) {
  const auth = LocalService.get('token');
  if (auth) {
    config.headers.Authorization = auth;
  }
  return config;
}

// 注销
function logout() {
  LocalService.remove('token');
  LocalService.remove('WebsitePermission');
  location.replace('/login.html');
}

// google抛错
function error1000(error) {
  const { data = [] } = error;
  const errorStr = data.map((text, index) => `<li>${index + 1}: ${text}</li>`).join('');
  MessageBox.alert(`<ul>${errorStr}</ul>`, 'Google服务器报错', {
    dangerouslyUseHTMLString: true
  });
}

// 网络错误
function errorHandling(error) {
  let message = '请求失败';
  const status = [400, 401, 403, 404, 405, 408, 500, 501, 502, 503, 504];
  const errorText = ['错误请求', '未授权，请重新登录', '拒绝访问', '请求错误,未找到该资源', '请求方法未允许', '请求超时', '服务器端出错', '网络未实现', '网络错误', '服务不可用', '网络超时'];
  const index = status.indexOf(error.status);
  if (index !== -1) message = errorText[index];
  MessageBox.alert('请刷新试试', message);

  logout();
  return;
}

// 设置loading
let loading;
let loadingCount = 0;
function mixinLoading(interceptors) {
  interceptors.request.use(loadingRequestInterceptor);
  interceptors.response.use(
    loadingResponseInterceptor,
    loadingResponseErrorInterceptor
  );

  function loadingRequestInterceptor(config) {
    if (!loading) {
      loading = Loading.service({
        target: 'body',
        background: 'transparent',
        text: '载入中'
      });
    }
    loadingCount++;

    return config;
  }

  function handleResponseLoading() {
    loadingCount--;
    if (loadingCount === 0) {
      loading.close();
      loading = null;
    }
  }

  function loadingResponseInterceptor(response) {
    handleResponseLoading();
    return response;
  }

  function loadingResponseErrorInterceptor(e) {
    handleResponseLoading();
    throw e;
  }
}
