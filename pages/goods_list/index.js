import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        value: "综合",
        isActive:true
      },
      {
        id: 1,
        value: "销量",
        isActive:false
      },
      {
        id: 2,
        value: "价格",
        isActive:false
      }
    ],
    // 商品列表
    goodsList:[],
  },

  //  总页数
  totalPageNum:1,


  // 接口要的参数
  queryParams:{
    query:"",
    cid: "",
    pagenum:1,
    pagesize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryParams.cid=options.cid || "";
    this.queryParams.query=options.query || ""; 
    console.log(options);
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search", data:this.queryParams});
    this.totalPageNum  = Math.ceil(res.total/this.queryParams.pagesize);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },
  

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index} = e.detail;
    // 2 修改源数组
    let {tabs} = this.data;
    tabs.forEach((v, i) => i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tab
    })
  },

  //页面上滑 滚动条触底事件
  onReachBottom(){
    if (this.queryParams.pagenum >= this.totalPageNum) {
      wx.showToast({title:"最后一页了"})
    } else {
      this.queryParams.pagenum++;
      this.getGoodsList()
    }
  },

  // 下拉刷新事件
  onPullDownRefresh(){
    // 重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页面
    this.queryParams.pagenum = 1;
    // 发送请求
    this.getGoodsList();
  }

})