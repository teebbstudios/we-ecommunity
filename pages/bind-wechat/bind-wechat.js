// pages/sos-confirm/confirm.js
import wxRequest from "wechat-request";
import {
  Routes
} from "../../config/route";
import {
  MsgTemplates
} from "../../config/templates";
import {
  ResidentApi,
  UserApi
} from "../../config/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    resident: null,
  },

  disagree: function () {
    wx.switchTab({
      url: Routes.index,
    })
  },

  agree: function (e) {
    wx.showLoading({
      title: '正在绑定中',
      mask: true,
    })
    let residentid = e.currentTarget.dataset.residentid;

    let userId = wx.getStorageSync('userId');
    wxRequest.put(ResidentApi.putItem(residentid), {
        owner: UserApi.getItem(userId)
      })
      .then(response => {
        wx.hideLoading();
        if (response.status == 200) {
          let resident = response.data;
          let familyIdIndex = resident.family.lastIndexOf('/');
          let familyId = resident.family.substring(familyIdIndex + 1);
          wx.setStorageSync('familyId', familyId);

          wx.showToast({
            icon: 'success',
            title: '绑定成功',
            complete: res => {
              wx.switchTab({
                url: Routes.index
              })
            }
          })
        } else {
          wx.showModal({
            title: '绑定失败，请稍候再试，或截图联系工作人员',
            content: response.data['hydra:description'],
            showCancel: false,
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    let userInfo = wx.getStorageSync('userInfo');
    let authToken = wx.getStorageSync('authToken');
    if (!userInfo || !authToken) {
      wx.showModal({
        title: "您还没有登录",
        content: "请您登录后再次扫码绑定微信，点击确定跳转到登录页面。",
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

    wx.showLoading({
      title: '正在加载中',
    })
    this.setData({
      userInfo
    });

    const residentId = decodeURIComponent(query.scene);

    //获取住户信息
    wxRequest.get(ResidentApi.getItem(residentId)).then(response => {
      wx.hideLoading();
      if (response.status == 200) {
        let resident = response.data;
        this.setData({
          resident
        })
      }
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