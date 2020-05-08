import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent:[],
    // 被点击的左侧的菜单
    currentIndex:0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },

  //接口的返回数据

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    * 1. 先判断一下本地存储中有没有旧的数据
    * 2. 没有旧数据 直接发送新请求
    * 3. 有旧数据且还没过期，就使用本地存储中的旧数据
    */ 

    // 1 获取本地存储中的数据（小程序中也是存在本地存储技术）
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates();
    } else {
      if (Date.now() - Cates.time > 1000*10){
        this.getCates();
      } else {
        this.Cates = Cates.data;
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v=>v.cat_name)
        //构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })

      }
    }
  },

  // 获取分类数据
  async getCates() {
    // request({ url: '/categories'})
    //   .then(result => {
    //     this.Cates = result.data.message;

    //     // 把接口的数据存入到本地存储中
    //     wx.setStorageSync("cates", {time:Date.now(), data: this.Cates});

    //     // 构造左侧的大菜单数据
    //     let leftMenuList = this.Cates.map(v=>v.cat_name)

    //     //构造右侧的商品数据
    //     let rightContent = this.Cates[0].children;

    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })

    //   }).catch(error => {
    //     console.log(error)
    //   })

    //  使用ES7 async await 请求
    const result=await request({url:"/categories"})
    this.Cates = result;

    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {time:Date.now(), data: this.Cates});

    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v=>v.cat_name)

    //构造右侧的商品数据
    let rightContent = this.Cates[0].children;

    this.setData({
      leftMenuList,
      rightContent
    })
  },

  //左侧菜单的点击事件
  handleItemTap(e){
    /*
    * 1. 获取被点击的标题身上的索引
    * 2. 给data中的currentIndex赋值就可以
    * 3. 根据不同的索引来渲染右侧的商品内容
    */ 
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop:0
    })
  }
})