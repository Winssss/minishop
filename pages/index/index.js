import { request } from '../../request/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数据
    swiperList:[],
    // 导航数据
    cateList: [],
    // 楼层数据
    floorList:[]
  },
  onLoad: function() {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 1. 发送异步请求获取轮播图数据
  getSwiperList() {
    request({ url: '/home/swiperdata'})
      .then(result => {
        this.setData({
          swiperList: result
        })
      }).catch(error => {
        console.log(error)
      })
  },
  //获取分类导航数据
  getCateList(){
    request({
      url: '/home/catitems'})
      .then(result => {
        this.setData({
          cateList: result
        })
      }).catch(error => {
        console.log(error)
      })
  },

  //获取楼层数据
  getFloorList(){
    request({
      url: '/home/floordata'
    })
      .then(result => {
        this.setData({
          floorList: result
        })
      }).catch(error => {
        console.log(error)
      })
  }
  
})