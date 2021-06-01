// pages/mine/mine.js
import wxRequest from "wechat-request";
import {
  UserApi
} from "../../config/api";
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
            wxRequest.post(UserApi.postLogin, loginParam, postConfig)
              .then(response => {
                wx.hideLoading();
                if (response.status === 204) {
                  this.setData({
                    userInfo
                  })
                  let token = response.headers.Jwt;
                  wx.setStorageSync('authToken', token)
                  wx.setStorageSync('isAdmin', response.headers["Admin"])
                  wx.setStorageSync('userId', response.headers["User-Id"])
                  wx.setStorageSync('familyId', response.headers["Family-Id"])
                  wx.setStorageSync('expireAt', response.headers["Expire-At"])
                  wx.setStorageSync('registered', response.headers["Registered"])

                  //登录成功后，添加Token
                  wxRequest.defaults.headers['Authorization'] = 'Bearer ' + token;

                  wx.showToast({
                    icon: 'none',
                    title: '登录成功',
                  })
                } else {
                  wx.showModal({
                    title: '登录失败，请稍候再试',
                    content: response.data['hydra:description'],
                    showCancel: false
                  })
                }
              })
          }
        })
      }
    })

  },

  navToProfile: function (e) {
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
      url: Routes.profile + `?id=${userId}`
    })
  },

  navToMyFamily: function (e) {
    let userInfo = wx.getStorageSync('userInfo');
    let authToken = wx.getStorageSync('authToken');
    if (!userInfo || !authToken) {
      wx.showToast({
        icon: 'error',
        title: '请登录后再试',
      })
      return;
    }
    let familyId = wx.getStorageSync('familyId');
    if (familyId == '') {
      wx.showToast({
        icon: 'error',
        title: '请登记住户信息',
      })
      return;
    }
    wx.navigateTo({
      url: Routes.family + `?id=${familyId}`
    })
  },

  navToMyQrcode: function (e) {
    let userInfo = wx.getStorageSync('userInfo');
    let authToken = wx.getStorageSync('authToken');
    if (!userInfo || !authToken) {
      wx.showToast({
        icon: 'error',
        title: '请登录后再试',
      })
      return;
    }
    let registered = wx.getStorageSync('registered');
    if (registered == '') {
      wx.showToast({
        icon: 'error',
        title: '请登记后再试',
      })
      return;
    }
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

  subscriberNotification: function (e) {
    wx.navigateTo({
      url: Routes.subscriber
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

  logout: function (event) {
    wx.removeStorageSync('authToken')
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('userId')
    wx.removeStorageSync('familyId')
    wx.removeStorageSync('expireAt')
    wx.removeStorageSync('registered')
    wx.removeStorageSync('isAdmin')

    wx.showToast({
      title: '清除成功',
    })
    wx.reLaunch({
      url: Routes.mine,
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