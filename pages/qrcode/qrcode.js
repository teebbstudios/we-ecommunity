// pages/qrcode/qrcode.js
import wxRequest from "wechat-request";
import {FamilyApi, UserApi, ResidentApi} from "../../config/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    qrcode: null,
    type: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载中',
    })
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    switch(options.type){
      case "family":
        wx.setNavigationBarTitle({
          title: '我的家庭二维码',
        })
        this.getQrcode(FamilyApi.getItemQrcode(options.familyId))
        break;
      case "profile":
        wx.setNavigationBarTitle({
          title: '我的个人二维码',
        })
        this.getQrcode(UserApi.getItemQrcode(options.userId))
        break;
      case "sos":
        wx.setNavigationBarTitle({
          title: '添加紧急联系人二维码',
        })
        this.setData({
          type: 'sosqrcode'
        });
        this.getQrcode(UserApi.getSosQrcode(options.userId))
        break;

      case "bindwechat":
        wx.setNavigationBarTitle({
          title: '住户绑定微信',
        })
        this.setData({
          type: 'bindwechat',
          residentName: options.residentName
        });
        this.getQrcode(ResidentApi.getItemBindQrcode(options.residentId))
        break;
    }
  },

  getQrcode: function(api){
    wxRequest.get(api).then(response=>{
      wx.hideLoading();
      if(response.status < 300){
        this.setData({
          qrcode: response.data
        })
      }
    })
  },
  previewImage: function(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.src],
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