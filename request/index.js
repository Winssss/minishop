let ajaxTimes = 0;
export const request = (params) => {
  ajaxTimes++
  // 显示加载中 效果
  wx.showLoading({
    title:"加载中",
    mask: true
  })
  // 定义公共的url
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
  return new Promise((resoleve, reject) => {
    wx.request({
      ...params,
      url: baseUrl+params.url,
      success: (result) => {
        resoleve(result.data.message);
      },
      fail: (error) => {
        reject(error);
      },
      complete:() => {
        // 关闭正在加载的图片
        ajaxTimes--
        if (ajaxTimes === 0) {
          wx.hideLoading()
        }
        
      }
    });
  })
}