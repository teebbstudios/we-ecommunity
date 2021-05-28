// pages/sos-confirm/confirm.js
import {
  Routes
} from "../../config/route";
import {
  MsgTemplates
} from "../../config/templates";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    tmplIds: [MsgTemplates.sos_add_contact, MsgTemplates.sos_send_help]
  },

  disagree: function () {

  },

  agree: function () {
    //同意订阅消息
    wx.requestSubscribeMessage({
      tmplIds: this.data.tmplIds
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    let userInfo = wx.getStorageSync('userInfo');
    let authToken = wx.getStorageSync('authToken');
    let userId = wx.getStorageSync('userId');
    let registered = wx.getStorageSync('registered');
    if (!userInfo || !authToken) {
      wx.showModal({
        title: "您还没有登录",
        content: "请您登录后再次扫码添加成为紧急联系人，点击确定跳转到登录页面。",
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
    //如果用户登录了，但是没有登记过，跳转登记。
    if (userId && registered == 0) {
      wx.showModal({
        title: "您还没有登记信息",
        content: "请您登记后再次扫码添加成为紧急联系人，点击确定跳转到登记页面。",
        showCancel: false,
        success: res => {
          if (res.confirm) {
            wx.reLaunch({
              url: Routes.register
            })
          }
        }
      })
      return;
    }
    this.setData({
      userInfo
    });

    //求助人的用户id
    const helperId = decodeURIComponent(query.scene);
    

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