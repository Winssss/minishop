// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        value: "体验问题",
        isActive:true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive:false
      }
    ],
    chooseImages:[],
    // 文本域内容
    textVal:""
  },
  // 外网的图片的路径数组
  UpLoadImgs:[],

  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index} = e.detail;
    // 2 修改源数组
    let {tabs} = this.data;
    tabs.forEach((v, i) => i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  },
  // 点击 “+”选择图片
  handleChooseImage(){
    // 调用小程序内置选择图片api
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          chooseImages: [...this.data.chooseImages, ...res.tempFilePaths]
        })
      }
    })
  },

  // 点击自定义图片组件
  handleRemoveImg(e){
    // 获取被点击的组件的索引
    const {index} = e.currentTarget.dataset;
    // 获取data中图片数组
    let {chooseImages} =this.data;
    // 删除元素
    chooseImages.splice(index, 1);
    this.setData({
      chooseImages
    })
  },

  // 文本域的输入的事件
  handleTextInput(e){
    this.setData({
      textVal: e.detail.value
    })
  },

  // 提交按钮的点击
  handleFormSubmit(){
    // 获取文本域的内容
    const {textVal, chooseImages}=this.data;
    // 合法性的验证
    if (!textVal.trim()){
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      })
      return;
    }

    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上存中",
      mask: true
    })
  

    // 判断是否需要上存的图片数组 {
    if (chooseImages.length != 0) {

        
        // 准备上存图片到专门的图片服务器
      chooseImages.forEach((v, i)=> {
        wx.uploadFile({
          // 图片要上存到哪里
          url: 'http://images.ac.cn/api/upload',
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称，后台来获取
          name: "file",
          // 顺带的文本信息
          formData: {},
          success: (res) => {
            let url = JSON.parse(reuslt.data).url;
            this.UpLoadImgs.push(url);
            
            // 所有的图片都上存完毕才触发
            if(i===chooseImages.length-1){
              wx.hideLoading()
              console.log("把文本的内容和外网的图片数组提交到后台中")
              //提交都成功了 （没有后台api， 这里模拟提交成功后返回的响应）
              // 重置页面
              this.setData({
                textVal: "",
                chooseImages: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        })
      })
    } else {
      wx.hideLoading();
      console.log("只是提交了文本");
      // 返回上一个页面
      wx.navigateBack({
        delta: 1
      });
    }
  }
})