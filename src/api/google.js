import apiHelper from './apiHelper';

const googleDomain = 'https://tcback.witemedia.com/google/api/v1';

/**
 * 项目
 */
export const findProjectBySearch = (params) => {
  return apiHelper.getWidthoutLoading(`${googleDomain}/findProjectBySearch`, params);
};
