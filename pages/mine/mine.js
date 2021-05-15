// pages/mine/mine.js
import wxRequest from "wechat-request";
import {
  UserApi
} from "../../config/api";
import {
  Routes
} from "../../config/route";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: '',
    userInfo: null,
  },

  login: function (event) {
    if (this.data.userInfo) {
      return;
    }
    wx.showLoading({
      title: '正在登录请稍候',
    })
    wx.getUserProfile({
      desc: '用于完善个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        let userInfo = res.userInfo;
        wx.setStorage({
          key: 'userInfo',
          data: res.userInfo
        });

        wx.login({
          success: code => {
            let loginParam = {
              code: code.code,
              userInfo
            }
            let postConfig = {
              headers: {
                "Content-Type": "application/json",
              }
            }
            wxRequest.post(UserApi.postLogin, loginParam, postConfig).then(response => {
              wx.hideLoading();

              this.setData({
                userInfo
              })
              let token = response.headers.Jwt;
              wx.setStorageSync('authToken', token)
              wx.setStorageSync('userId', response.headers["User-Id"])
              wx.setStorageSync('familyId', response.headers["Family-Id"])
              wx.setStorageSync('expireAt', response.headers["Expire-At"])

              //登录成功后，添加Token
              wxRequest.defaults.headers['Authorization'] = 'Bearer ' + token;

              wx.showToast({
                icon: 'none',
                title: '登录成功',
              })
            })
          }
        })
      }
    })

  },

  navToProfile: function (e) {

  },

  navToMyFamily: function (e) {
    let familyId = wx.getStorageSync('familyId');
    wx.navigateTo({
      url: Routes.family + `?id=${familyId}`
    })
  },

  navToMyQrcode: function (e) {
    let userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: Routes.qrcode + `?userId=${userId}&type=profile`
    })
  },

  navToMyReservations: function (e) {
    wx.navigateTo({
      url: Routes.interactiveList + `?type=reservation&mine=true`
    })
  },
  navToMySuggestions: function (e) {
    wx.navigateTo({
      url: Routes.interactiveList + `?type=suggestion&mine=true`
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取版本号
    const accountInfo = wx.getAccountInfoSync();

    //获取用户信息
    var userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      return;
    }
    this.setData({
      version: accountInfo.miniProgram.version,
      userInfo
    })
  },

  clearCache: function (event) {
    wx.clearStorage({
      success: (res) => {
        wx.showToast({
          title: '清除成功',
        })
        wx.reLaunch({
          url: Routes.mine,
        })
      },
    })
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