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
    type: null,
    typeName: null,
    addRoute: null,
    loadApi: null,
    isMinePage: false,
    typeProperty: null,
    loadApiParams: {
      page: 1,
      itemsPerPage: 4,
    },
    typeList: [{
        name: "意见建议",
        typeSlug: "suggestion",
        addRoute: Routes.suggestion,
        loadApi: SuggestionApi.getCollection,
        typeProperty: 'suggestionType.name',
      },
      {
        name: "预约办理",
        typeSlug: "reservation",
        addRoute: Routes.reservation,
        loadApi: ReservationApi.getCollection,
        typeProperty: 'reservationType.name',
      }
    ],
    contents: [],
    beforeContents: [],
    beforePage: null,
    beformNomore: false,
    nomore: false,
    keywords: null,
  },

  onFocus: function () {
    this.setData({
      cancelShow: true
    });
  },

  reset: function () {
    let loadApiParams = this.data.loadApiParams;
    delete loadApiParams[this.data.typeProperty];
    delete loadApiParams["description"];

    this.setData({
      keywords: '',
      cancelShow: false,
      contents: this.data.beforeContents,
      loadApiParams,
      "loadApiParams.page": this.data.beforePage,
      nomore: this.data.beformNomore,
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
      if (contents.length < this.data.loadApiParams.itemsPerPage) {
        this.setData({
          nomore: true,
        })
      }
      this.setData({
        contents: this.data.contents.concat(contents)
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

    wx.setNavigationBarTitle({
      title: isMinePage ? '我的' : '' + this.data.typeName + '列表',
    })

    if (this.data.isMinePage) {
      let loadApiParams = {
        ...this.data.loadApiParams,
        "author.id": wx.getStorageSync('userId')
      }
      this.setData({
        loadApiParams
      })
    }

    this.loadData();
  },

  openDetail: function (e) {
    let id = e.currentTarget.id;
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: Routes.interactive + `?id=${id}&type=${this.data.type}`,
      success: (res) => {
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
  //搜索
  search: function (e) {
    wx.showLoading({
      title: '正在搜索中',
    })
    //每次搜索时清除页码和之前的内容，nomore
    this.setData({
      beformNomore: this.data.nomore,
      beforePage: this.data.loadApiParams.page,
      beforeContents: this.data.contents,
      contents: [],
      "loadApiParams.page": 1,
      nomore: false,
    })
    let keywords = e.detail.value;
    let loadApiParams = {
      ...this.data.loadApiParams,
      [this.data.typeProperty]: keywords,
      "description": keywords,
    }

    this.setData({
      keywords,
      loadApiParams
    })

    this.loadData(true);

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
  scrollToLower: function () {
    if (!this.data.nomore) {
      wx.showLoading({
        title: '正在加载中',
        mask: true,
      })
      this.setData({
        "loadApiParams.page": this.data.loadApiParams.page + 1,
      })
      this.loadData();
    }
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