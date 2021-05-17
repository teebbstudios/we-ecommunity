// pages/sos/sos.js
import {
  Routes
} from "../../config/route";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: 3,
    clocker: null,
    boolShowSeconds: false,
    showTitle: null,
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
        this.setData({
          boolShowSeconds: false,
          timer: 3,
        });
        wx.showToast({
          icon: 'success',
          title: '发送成功',
        })
        clearInterval(timer);
      } else {
        this.setData({
          boolShowSeconds: true,
          timer: this.data.timer - 1,
          showTitle: "发送倒计时 " + this.data.timer + " 秒",
        });
        //手机震动
        // wx.vibrateShort({type: "heavy"});
        wx.vibrateLong();
      }
      seconds++;
    }, 1000);

    this.setData({
      clocker: timer,
    })
  },
  touchEnd: function (e) {
    if (this.data.clocker) {
      boolShowSeconds: false,
      clearInterval(this.data.clocker);
      this.setData({
        timer: 3
      });
    }
  },

  navToQrcode: function (e) {
    let userInfo = wx.getStorageSync('userInfo');
    let authToken = wx.getStorageSync('authToken');
    if (!userInfo || !authToken) {
      wx.showToast({
        icon: 'error',
        title: '请登录后再试',
      })
      return;
    }
    let userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: Routes.qrcode + `?userId=${userId}&type=sos`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    let authToken = wx.getStorageSync('authToken');
    if (!userInfo || !authToken) {
      wx.showModal({
        title: '您还没有登录',
        content: "请您登录后再次操作，点击确定跳转到登录页面",
        showCancel: false,
        success: res => {
          if (res.confirm) {
            wx.reLaunch({
              url: Routes.mine
            })
          }
        }
      })
      return;
    }
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