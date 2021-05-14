// pages/list/list.js
import wxRequest from "wechat-request";
import {
  SuggestionApi,
  ReservationApi
} from "../../config/api";
import {
  Routes
} from "../../config/route";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ready: false,
    type: null,
    typeName: null,
    imgList: [],
    typeList: [{
        name: "意见建议",
        typeSlug: "suggestion",
      },
      {
        name: "预约办理",
        typeSlug: "reservation",
      }
    ],
    detail: null,
  },
  viewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  onFocus: function () {
    this.setData({
      cancelShow: true
    });
  },
  search: function (event) {
    console.log(event);
  },
  reset: function () {
    this.setData({
      keywords: '',
      cancelShow: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      id,
      type
    } = options;
    this.data.typeList.map(item => {
      if (item.typeSlug === type) {
        this.setData({
          type: item.typeSlug,
          typeName: item.name
        })
        wx.setNavigationBarTitle({
          title: item.name + `详情`,
        })
      }
    })
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      let imgList = [];
      data.data.attachments.map(item => {
        imgList.push(item.url);
      })
      this.setData({
        imgList,
        detail: data.data,
      })
    })
  },

  addAppreciate: function (e) {
    let likeCount = e.currentTarget.dataset.likecount + 1;
    let currentId = e.currentTarget.id;

    if (this.data.detail.liked) {
      wx.showToast({
        icon: 'error',
        title: '您已经点过赞啦',
      })
      return;
    }

    wxRequest.put(SuggestionApi.putItem(currentId), {
      likeCount
    }).then(response => {
      if (response.status == 200) {
        this.setData({
          "detail.likeCount": likeCount,
          "detail.liked": true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      ready: true,
    })
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