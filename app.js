// app.js
import wxRequest from 'wechat-request';
import { ApiConfig } from './config/api';

wxRequest.defaults.baseURL = ApiConfig.apiHost;
wxRequest.defaults.headers.common.Accept = ApiConfig.accept + wxRequest.defaults.headers.common.Accept;
wxRequest.defaults.headers.get['Content-Type'] = ApiConfig.contentType;
wxRequest.defaults.headers.post['Content-Type'] = ApiConfig.contentType;
wxRequest.defaults.headers.patch['Content-Type'] = ApiConfig.contentType;

App({
  globalData: {},

  onLaunch() {
    
    // 获取系统状态栏信息
    // wx.getSystemInfo({
    //   success: e => {
    //     console.log(e);
    //     this.globalData.StatusBar = e.statusBarHeight;
    //     let capsule = wx.getMenuButtonBoundingClientRect();
    //     if (capsule) {
    //       this.globalData.Custom = capsule;
    //       this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
    //     } else {
    //       this.globalData.CustomBar = e.statusBarHeight + 50;
    //     }
    //   }
    // })
  }

})