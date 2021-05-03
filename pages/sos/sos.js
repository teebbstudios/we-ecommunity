// pages/sos/sos.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: 3,
    clocker: null,
  },
  // 按钮触摸开始触发的事件
  touchStart: function (e) {
    wx.getLocation({
      type: "gcj02",
      success(res) {
        console.log(res);
        let latitude = res.latitude;
        let longitude = res.longitude;
      }
    });

    let seconds = 1;
    let timer = setInterval(() => {
      if (seconds > 3) {
        //todo: 发送通知
        wx.hideLoading();
        clearInterval(timer);
        this.setData({
          timer: 3
        });
      } else {
        wx.showLoading({
          title: '倒计时 ' + this.data.timer,
        });
        this.setData({
          timer: this.data.timer - 1
        });
        //手机震动
        // wx.vibrateShort({type: "heavy"});
        wx.vibrateLong();
      }
      seconds++;
    }, 1000);
    this.setData({
      clocker: timer
    })
  },
  touchEnd: function (e) {
    if (this.data.clocker) {
      wx.hideLoading();
      clearInterval(this.data.clocker);
      this.setData({
        timer: 3
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})