// app.js
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