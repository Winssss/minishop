import { request } from '../../request/index';
// 处理 es7的代码
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        value: "全部订单",
        isActive:true
      },
      {
        id: 1,
        value: "待付款",
        isActive:false
      },
      {
        id: 2,
        value: "待发货",
        isActive:false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive:false
      },
    ],
    orderList: []
  },
  onShow(options){

    // const token = wx.getStorageSync('token');
    // if (!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/index'
    //   })
    // }

    // 获取页面栈
    const page = getCurrentPages();
    // 获取当前页面栈
    const currentPage = page[page.length-1];
    // 获取当前页面的type值
    const {type} = currentPage.options;
    this.getOrderList(type);
    this.changeIndexItem(type-1);
  },


  // 根据标题索引来激活选中标题数组
  changeIndexItem(index){
    let {tabs} = this.data;
    tabs.forEach((v, i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

  handleTabsItemChange(e) {
    const {index} = e.detail;
    this.changeIndexItem(index);
    this.getOrderList(index+1);
  },

  // 获取订单数据
  async getOrderList(type){
    const res = await request({url: "/my/orders/all", data:{type}})
    console.log(res)
  }


})