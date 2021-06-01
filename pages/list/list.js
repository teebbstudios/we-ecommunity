// pages/list/list.js
import wxRequest from "wechat-request";
import {
  CategoryApi,
  PostApi
} from "../../config/api";
import {
  Routes
} from "../../config/route";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: null,
    categoryName: '',
    swiperList: [],
    posts: [],
    nomore: false,
    page: 1,
  },

  getPostList: function (params) {
    return wxRequest.get(PostApi.getCollection, {
      params
    });
  },

  getSimplePostList: function () {
    let simpleCategoryParams = {
      "category.slug": this.data.category,
      boolTop: false,
      page: this.data.page,
      itemsPerPage: 10
    };

    this.getPostList(simpleCategoryParams).then((response) => {
      wx.hideLoading();
      let posts = response.data['hydra:member'];
      if (posts.length === 0) {
        this.setData({
          nomore: true,
        })
      }
      let postList = this.data.posts;
      posts.map((item) => {
        let post = {
          id: item.id,
          postImage: item.postImage ? item.postImage.url : null,
          title: item.title,
          summary: item.summary,
          category: item.category.name,
          createdAt: item.createdAt
        }
        postList.push(post);
        this.setData({
          posts: postList,
        });
      })

      if (postList.length < 10) {
        this.setData({
          nomore: true
        })
      }
    })
  },
  navToDetail: function (event) {
    let id = event.currentTarget.id;
    Routes.navTo(Routes.postDetail, `?id=${id}`);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      category: options.category,
      categoryName: options.title
    })
    wx.setNavigationBarTitle({
      title: options.title,
    })
    wx.showLoading({
      title: '正在加载中',
    })
    let bannerParams = {
      "category.slug": options.category,
      boolTop: true,
      itemsPerPage: 5
    };
    this.getPostList(bannerParams).then(response => {
      let list = response.data['hydra:member'];
      let bannerList = [];
      list.map(item => {
        let banner = {
          id: item.id,
          title: item.title,
          url: item.postImage.url
        }
        bannerList.push(banner);
        this.setData({
          swiperList: bannerList
        })
      })
    })

    this.getSimplePostList();
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
      wx.showLoading({
        title: '正在加载中',
      })
      this.setData({
        page: this.data.page + 1
      })

      this.getSimplePostList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})