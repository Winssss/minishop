import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollected: false
  },

  goodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    const {goods_id} = options;
    this.getGoogsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoogsDetail(goods_id){
    const goodsObj = await request({url:"/goods/detail", data:{goods_id}})
    this.goodsInfo=goodsObj;
    // 获取缓存中收藏的数据
    let collect = wx.getStorageSync('collect') || [];
    // 判断当前商品是否被收藏
    let isCollected = collect.some(v=>v.goods_id===goodsObj.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // 解决iphone部分机型不支持webp格式图片
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics:goodsObj.pics
      },
      isCollected
    });
  },

  //点击轮播图 放大预览
  handlePrviewImage(e) {
    const urls = this.goodsInfo.pics.map(v=>v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    })
  },

  //点击加入购物车
  handleCartAdd(){
    let cart = wx.getStorageSync("cart") || [];
    let index = cart.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    if (index === -1){
      this.goodsInfo.num = 1;
      this.goodsInfo.checked = true;
      cart.push(this.goodsInfo)
    } else {
      cart[index].num++
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title:"加入成功",
      icon:"success",
      mask: true
    })
  },

  //点击商品收藏图标
  handleCollect() {

    let isCollected = false;

    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];

    // 判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);

    if (index != -1){
      collect.splice(index, 1);
      isCollected = false;
    } else{
      collect.push(this.goodsInfo)
      isCollected = true;
    }

    // 将数组存入缓存中
    wx.setStorageSync('collect', collect);
    
    this.setData({
      isCollected
    })

  }
})