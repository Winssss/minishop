import {getSetting, chooseAddress, openSetting, showModal, showToast} from '../../utils/asyncWX.js';
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];

    // 过滤后的购物车数据
    cart=cart.filter(v=>v.checked);
    this.setData({address});
    // 总价格 和 总数量
    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach(v => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
    })
  },
  
  // 点击 支付
  handleOrderPay() {
    // 判断缓存中有没有token
    const token = wx.getStorageSync('token');
    if (!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return;
    }
    console.log("已经存在token");
  }
})