// pages/sos/sos.js
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
    timer: 3,
    clocker: null,
    boolShowSeconds: false,
    showTitle: null,
    sosListeners: [],
    sosListenerIRIs: [],
    latitude: null,
    longitude: null,
  },
  // 按钮触摸开始触发的事件
  touchStart: function (e) {
    if (this.data.sosListeners.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先添加联系人'
      })
      return;
    }
    wx.getLocation({
      type: "gcj02",
      success: res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    });

    let seconds = 1;
    let timer = setInterval(() => {
      if (seconds > 3) {
        this.setData({
          boolShowSeconds: false,
          timer: 3,
        });

        //发送求助通知
        if (!this.data.latitude || !this.data.longitude) {
          wx.getLocation({
            type: "gcj02",
            success: res => {
              this.setData({
                latitude: res.latitude,
                longitude: res.longitude
              })
            }
          })
        }
        let params = {
          latitude: this.data.latitude,
          longitude: this.data.longitude
        }
        let postConfig = {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/ld+json, application/json",
            "Authorization": 'Bearer ' + wx.getStorageSync('authToken')
          }
        }

        let userId = wx.getStorageSync('userId')
        wxRequest.post(UserApi.postItemSendSos(userId), params, postConfig)
          .then(response => {
            if (response.status == 204) {
              wx.showToast({
                icon: 'success',
                title: '发送成功',
              })
            }
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
  callPhone: function (e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
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
    let registered = wx.getStorageSync('registered');
    if (!registered) {
      wx.showToast({
        icon: 'error',
        title: '请您登记后再试',
      })
      return;
    }

    let userId = wx.getStorageSync('userId');

    wx.requestSubscribeMessage({
      tmplIds: [
        MsgTemplates.sos_add_contact
      ],
      complete: res => {
        wx.navigateTo({
          url: Routes.qrcode + `?userId=${userId}&type=sos`
        })
      }
    })
  },
  getUserSosListeners: function () {
    let userId = wx.getStorageSync('userId');
    return wxRequest.get(UserApi.getItem(userId))
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
    wx.showLoading({
      title: '正在加载中',
      mask: true,
    })
    this.getUserSosListeners().then(response => {
      wx.hideLoading();
      let sosListeners = response.data.sosListeners;
      let sosListenerIRIs = [];
      sosListeners.map(item => {
        sosListenerIRIs.push(item['@id'])
      })
      this.setData({
        sosListeners,
        sosListenerIRIs
      })
    })
  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  removeSosListener: function (e) {
    let userId = wx.getStorageSync('userId');
    wx.showModal({
      title: '您将要删除联系人“' + e.currentTarget.dataset.listenername + '”,确定吗？',
      success: res => {
        if (res.confirm) {
          let removeListenerId = e.currentTarget.dataset.listenerid;
          let sosListenerIRIs = this.data.sosListenerIRIs;
          let index = sosListenerIRIs.indexOf(removeListenerId);
          sosListenerIRIs.splice(index, 1);

          wxRequest.put(UserApi.putItem(userId), {
            sosListeners: sosListenerIRIs
          }).then(res => {
            if (res.status == 200) {
              wx.showToast({
                icon: 'success',
                title: '删除联系人成功',
                complete: result => {
                  wx.reLaunch({
                    url: Routes.sos
                  })
                }
              })
            }
          })

        }
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