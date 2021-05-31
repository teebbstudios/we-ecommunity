// pages/sos-confirm/confirm.js
import wxRequest from "wechat-request";
import {
  Routes
} from "../../config/route";
import {
  MsgTemplates
} from "../../config/templates";
import {
  UserApi
} from "../../config/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    helperId: null,
    helperInfo: null,
    sosListeners: [], //紧急联系人列表
    sosListenerIRIs: [], //紧急联系人IRI列表
    tmplIds: [MsgTemplates.sos_add_contact, MsgTemplates.sos_send_help]
  },

  disagree: function () {
    wx.switchTab({
      url: Routes.index,
    })
  },

  agree: function (e) {
    let helperId = e.currentTarget.dataset.helperid;
    //同意订阅消息
    wx.requestSubscribeMessage({
      tmplIds: this.data.tmplIds,
      complete: res => {
        //发送请求为求助人添加紧急联系人
        let userId = wx.getStorageSync('userId');
        if (this.data.sosListeners.includes(UserApi.getItem(userId))) {
          wx.showModal({
            title: '您已经是' + this.data.helperInfo.name + '的紧急联系人了，请不要重复添加。',
            showCancel: false,
          })
          return;
        }
        let sosListenerIRIs = this.data.sosListenerIRIs;
        sosListenerIRIs.push(UserApi.getItem(userId));

        wxRequest.put(UserApi.putItem(helperId), {
          sosListeners: sosListenerIRIs
        }).then(response => {
          if (response.status === 200) {
            wx.showToast({
              icon: 'success',
              title: '联系人添加成功',
              complete: res => {
                wx.switchTab({
                  url: Routes.index,
                })
              }
            })
          }
        })
      }
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

    //求助人的用户id
    const helperId = decodeURIComponent(query.scene);
    //如果求助人和当前用户是同一个人，则提醒
    if (helperId == userId) {
      wx.showModal({
        title: '您不能添加自己为紧急联系人',
        showCancel: false,
      })
      return;
    }
    this.setData({
      helperId,
      userInfo
    });
    wx.showLoading({
      title: '正在加载中',
    })

    //获取求助人的信息
    wxRequest.get(UserApi.getItem(helperId)).then(response => {
      wx.hideLoading();
      if (response.status == 200) {
        let helper = response.data;

        let sosListenerIRIs = [];
        helper.sosListeners.map(item => {
          sosListenerIRIs.push(item['@id'])
        })

        this.setData({
          helperInfo: helper.resident,
          sosListeners: helper.sosListeners,
          sosListenerIRIs
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