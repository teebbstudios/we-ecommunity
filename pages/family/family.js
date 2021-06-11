// pages/family/family.js
import wxRequest from "wechat-request";
import {
  FamilyApi
} from "../../config/api";
import {
  Routes
} from "../../config/route";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    familyId: null,
    family: null,
    residents: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载中',
    })
    let familyId = options.id;
    this.setData({
      familyId
    })
    
    let userFamilyId = wx.getStorageSync('familyId');
    let userIsAdmin = wx.getStorageSync('isAdmin');

    if(userFamilyId == "" && userIsAdmin == ""){
      wx.showToast({
        icon: 'error',
        title: '请先登记信息',
      })
      return;
    }
    // if(userFamilyId !== familyId && userIsAdmin == ""){
    //   wx.showToast({
    //     icon: 'error',
    //     title: '您无权查看信息',
    //   })
    // }

    wxRequest.get(FamilyApi.getItem(familyId)).then(response => {
      wx.hideLoading();
      if(response.status == 200){
        let residents = [];
        let family = response.data;
        response.data.residents.map(item => {
          let resident = item;
  
          resident.selfieTmp = item.selfie.url;
          resident.relationWithHostName = item.relationWithHost.name;
          resident.relationWithRoomName = item.relationWithRoom.name;
          resident.house = family.community.name + family.building.buildingName + family.unit.unitName + family.room.roomNum;
          resident.age= this.getAge(item.birthday);
  
          residents.push(resident);  
          this.setData({
            family,
            residents
          })
        })
      }else{
        wx.showModal({
          title: response.data['hydra:description'],
          showCancel: false,
          success: res=>{
            if(res.confirm){
              wx.navigateBack();
            }
          }
        })
      }
    });
  },

  getAge: function (birthday) {
    //出生时间 毫秒
    let birthDayTime = new Date(birthday).getTime();
    //当前时间 毫秒
    let nowTime = new Date().getTime();
    //一年毫秒数(365 * 86400000 = 31536000000)
    return Math.ceil((nowTime - birthDayTime) / 31536000000);
  },

  navToQrcode: function(e){
    wx.navigateTo({
      url: Routes.qrcode + `?familyId=${this.data.familyId}&type=family`
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