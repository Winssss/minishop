import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
import {login} from '../../utils/asyncWX';
Page({
  // 获取用户信息
  async handleGetUserInfo(e){
    // 获取用户信息
    const {encryptedData, iv, rawData, signature} = e.detail;
    // 获取小程序登录成功后的code
    const {code} = await login();
  }

  // 由于没有企业账号， 支付功能暂时无法实现
})

