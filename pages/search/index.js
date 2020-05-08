import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消按钮 是否显示
    isFocused: false,
    // 输入框的值
    inpValue: ""
  },
  TimeId:-1,
  //输入框的值改变就会触发的事件
  handleInput(e){
    // 获取输入框的值
    const {value}=e.detail;
    // 检测合法性
    if(!value.trim()) {
      // 值不合法
      this.setData({
        goods:[],
        isFocused: false
      })
      return;
    }
    //准备发送请求获取数据
    this.setData({
      isFocused: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(()=>{
      this.qsearch(value)
    }, 1000)
  },

  // 发送请求获取搜索数据
  async qsearch(query){
    const res=await request({url:"/goods/qsearch", data:{query}});
    this.setData({
      goods: res
    })
  },
  //点击取消按钮
  handleCancle() {
    this.setData({
      inpValue:"",
      isFocused: false,
      goods:[]
    })
  }

})