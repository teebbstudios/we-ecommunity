// pages/search/search.js
import wxRequest from 'wechat-request';
import {
  PostApi
} from '../../config/api';
import {
  Routes
} from '../../config/route';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    keywords: '',
    category: '',
    results: [],
    page: 1,
    loadingComplete: false,
    nomore: false,
  },

  getSearchResults: function (keywords, category) {
    let params = {
      title: keywords,
      body: keywords,
      'category.slug': category,
      page: this.data.page,
      itemsPerPage: 10
    }
    wxRequest.get(PostApi.getCollection, {
      params
    }).then((response) => {
      let posts = response.data['hydra:member'];
      let postList = this.data.results;
      posts.map((item) => {
        let post = {
          id: item.id,
          postImage: item.postImage.url,
          title: item.title,
          summary: item.summary,
          category: item.category.name,
          createdAt: item.createdAt
        }
        postList.push(post);
        this.setData({
          results: postList
        });
      })

      if (postList.length < 10) {
        this.setData({
          nomore: true
        })
      }

      this.setData({
        loadingComplete: true,
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      keywords: options.keywords,
      category: options.category
    })
    wx.setNavigationBarTitle({
      title: '搜索“' + options.keywords + '”',
    })
    this.getSearchResults(options.keywords, options.category);
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
    if (!this.data.nomore) {
      this.setData({
        page: this.data.page + 1
      })
      this.getSearchResults(this.data.keywords, this.data.category);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tabSelect: function (e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }
})