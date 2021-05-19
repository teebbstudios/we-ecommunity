// pages/family/family.js
import wxRequest from "wechat-request";
import {
  ResidentApi,
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
    info: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载中',
    })
    let userId = options.id;
    wxRequest.get(ResidentApi.getCollection, {
      params: {
        "owner.id": userId
      }
    }).then(response => {
      wx.hideLoading()
      if(response.status === 200){
        if(response.data["hydra:member"].length == 0){
          wx.showModal({
            title: '您还没有登记住户信息',
            confirmText: '立即登记',
            success: res=>{
              if(res.confirm){
                wx.navigateTo({
                  url: Routes.register
                })
              }
            }
          })
        }
        let resident = response.data["hydra:member"][0];
        this.setData({
          info: resident,
          "info.age": this.getAge(resident.birthday),
          "info.selfieTmp": resident.selfieUrl,
          "info.relationWithHostName": resident.relationWithHost.name,
          "info.relationWithRoomName": resident.relationWithRoom.name,
          "info.house": resident.house,
        })
      }
    })
  },

  getAge: function (birthday) {
    //出生时间 毫秒
    let birthDayTime = new Date(birthday).getTime();
    //当前时间 毫秒
    let nowTime = new Date().getTime();
    //一年毫秒数(365 * 86400000 = 31536000000)
    return Math.ceil((nowTime - birthDayTime) / 31536000000);
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