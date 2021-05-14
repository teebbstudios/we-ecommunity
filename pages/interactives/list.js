// pages/list/list.js
import wxRequest from "wechat-request";
import {
  ReservationApi,
  SuggestionApi
} from "../../config/api";
import {
  Routes
} from "../../config/route";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    type: null,
    typeName: null,
    addRoute: null,
    loadApi: null,
    isMinePage: false,
    typeProperty: null,
    loadApiParams: {
      page: 1,
      itemsPerPage: 10,
    },
    typeList: [{
        name: "意见建议",
        typeSlug: "suggestion",
        addRoute: Routes.suggestion,
        loadApi: SuggestionApi.getCollection,
        typeProperty: 'suggestionType',
      },
      {
        name: "预约办理",
        typeSlug: "reservation",
        addRoute: Routes.reservation,
        loadApi: ReservationApi.getCollection,
        typeProperty: 'reservationType',
      }
    ],
    contents: [],
    nomore: false,
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

  getPageContents: function () {
    return wxRequest.get(this.data.loadApi, {
      params: this.data.loadApiParams
    });
  },

  loadData: function () {
    //加载数据
    this.getPageContents().then(response => {
      wx.hideLoading();
      let contents = response.data["hydra:member"];
      if (contents.length < 10) {
        this.setData({
          nomore: true,
        })
      }
      this.setData({
        contents: this.data.contents.concat(response.data["hydra:member"])
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    })

    let isMinePage = options.mine ? options.mine : false;
    let type = options.type;
    this.data.typeList.map(item => {
      if (type === item.typeSlug) {
        this.setData({
          type,
          typeName: item.name,
          addRoute: item.addRoute,
          loadApi: item.loadApi,
          typeProperty: item.typeProperty,
          isMinePage,
        })
      }
    })

    if (this.data.isMinePage) {
      this.setData({
        loadApiParams: {
          "author.id": wx.getStorageSync('userId')
        }
      })
    }

    this.loadData();
  },

  openDetail: function (e) {
    let id = e.currentTarget.id;
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: Routes.interactive + `?id=${id}&type=${this.data.type}`,
      success:(res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: this.data.contents[index]
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  addBtnSubmit: function () {
    wx.navigateTo({
      url: this.data.addRoute,
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
    if (!this.data.nomore) {
      wx.showLoading({
        title: '正在加载中',
      })
      this.setData({
        "loadApiParams.page": this.data.page + 1,
      })
      this.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})