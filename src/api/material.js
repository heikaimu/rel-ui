import apiHelper from './apiHelper';

const materialDomain = 'https://tcback.witemedia.com/source-material/api/v1';

/**
 * 图片
 */
export const myPictures = (params) => {
  return apiHelper.getWidthoutLoading(`${materialDomain}/getAllPicBySearch`, params);
};

/**
 * 视频
 */
export const myVideos = (params) => {
  return apiHelper.getWidthoutLoading(`${materialDomain}/getAllVideoBySearch`, params);
};
