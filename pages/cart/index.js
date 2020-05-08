import {getSetting, chooseAddress, openSetting, showModal, showToast} from '../../utils/asyncWX.js';
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({
  // // 点击收货地址
  // handleChooseAddress(){
  //   // 获取权限状态
  //   wx.getSetting({
  //     success:(result)=>{
  //       let scopeAddress = result.authSetting["scope.address"];
  //       if (scopeAddress === true || scopeAddress === undefined){
  //         wx.chooseAddress({
  //           success: (result1) => {
  //             console.log(result1)
  //           }
  //         })
  //       } else {
  //         // 用户以前拒绝过授予权限，诱导用户打开授权页面
  //         wx.openSetting({
  //           success: () => {
  //             wx.chooseAddress({
  //               success: (result2) => {
  //                 console.log(result2)
  //               }
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || [];

    this.setData({address});
    this.setCart(cart);
  },
  
  async handleChooseAddress() {
    try{
      // 获取权限状态
      const  result = await getSetting();
      let scopeAddress = result.authSetting["scope.address"];

      // 判断权限状态
      if (scopeAddress === false){
        await openSetting();
      }

      // 调用获取收货地址的api
      const address = await chooseAddress();
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      // 将地址存入缓存中
      wx.setStorageSync('address', address);  
    } catch (e) {
      console.log(e)
    }
  },

  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品的Id
    const goodsId = e.currentTarget.dataset.id;
    // 获取购物车数组
    let {cart}=this.data;
    let index = cart.findIndex(v=>v.goods_id === goodsId);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },

  // 设置购物车状态,同时重新计算底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
    
    // 计算全选
    let allChecked = true;

    // 总价格 和 总数量
    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });

    // 判断数据是否为空
    allChecked = cart.length!=0?allChecked:false;
    wx.setStorageSync('cart', cart);
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
  },

  // 商品全选功能
  handleItemAllChecked(){
    // 获取data中的数据
    let {cart, allChecked}=this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 把修改后的值,填充回data和缓存中
    this.setCart(cart);
  },

  //  商品数量的编辑功能
  async handleItemNumEdit(e){
    // 获取传递过来的参数
    const {operation, id} = e.currentTarget.dataset;
    //  获取购物车数组
    let {cart}=this.data;
    // 找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id);

    // // 判断数量是否为1且用户点击-1
    // if (cart[index].num === 1 && operation == -1){
    //   wx.showModal({
    //     title: '提示',
    //     content: '是否删除?',
    //     success: (res) => {
    //       if (res.confirm) {
    //         cart.splice(index, 1)
    //         this.setCart(cart);
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // }

    // 判断数量是否为1且用户点击-1
    if (cart[index].num === 1 && operation == -1){
      const res = await showModal({content: '是否删除?'});
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart);
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }else {
      // 进行修改数量
      cart[index].num+=operation;
      // 设置缓存和数组的数据
      this.setCart(cart);
    }
  },

  
  // 点击支付
  async handlePay(){
    // 获取地址和总数量
    const {address, totalNum} = this.data;

    // 判断地址是否选中
    if (!address.userName){
      await showToast({title:"您没有选中地址"})
      return;
    }

    // 判断地址是否选中
    if (totalNum === 0){
      await showToast({title:"您没有选中商品"})
      return;
    }

    wx.navigateTo({
      url: '/pages/pay/index'
    })

  }

})