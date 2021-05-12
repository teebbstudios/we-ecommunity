// pages/index/index.js
import wxRequest from 'wechat-request';

import {
  PostApi
} from '../../config/api';
import { Routes } from '../../config/route';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    notification: {
      id: '',
      title: '',
      body: '',
      imagePost: '',
    },
    posts: [],
    page: 1,
    nomore: false,
    Routes
  },

  getPostList: function (params) {
    return wxRequest.get(PostApi.getCollection, {
      params
    });
  },

  getSimplePost: function () {
    let simpleNewsParams = {
      categoryNotEqual: 'notification',
      boolTop: false,
      page: this.data.page,
      itemsPerPage: 10
    }
    this.getPostList(simpleNewsParams).then((response) => {
      wx.hideLoading();

      let posts = response.data['hydra:member'];
      if(posts.length === 0){
        this.setData({
          nomore: true,
        })
      }
      let postList = this.data.posts;
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
          posts: postList,
        });
      })
      
      if(postList.length < 10){
        this.setData({
          nomore: true
        })
      }
    })
  },

  getIndexData: function () {
    let bannerParams = {
      categoryNotEqual: 'notification',
      boolTop: true,
      itemsPerPage: 5
    };
    let notificationParams = {
      'category.slug': 'notification',
      itemsPerPage: 1
    };
    wxRequest.all([
      this.getPostList(bannerParams),
      this.getPostList(notificationParams)
    ]).then(response => {
      let banners = response[0].data['hydra:member'];
      let bannerList = [];
      banners.map((item) => {
        let banner = {
          id: item.id,
          url: item.postImage.url,
          title: item.title
        }
        bannerList.push(banner);
        this.setData({
          swiperList: bannerList
        });
      })

      let notifications = response[1].data['hydra:member'];
      this.setData({
        notification: {
          id: notifications[0].id,
          title: notifications[0].title,
          body: notifications[0].body,
          postImage: notifications[0].postImage.url,
        }
      });
    })
  },

  navToDetail: function(event){
    let id = event.currentTarget.id;
    Routes.navTo(Routes.postDetail, `?id=${id}`);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载内容',
    });
    //并发获取首页数据
    this.getIndexData();
    this.getSimplePost();
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
    if(!this.data.nomore){
      wx.showLoading({
        title: '正在加载中',
      })
      this.setData({
        page: this.data.page + 1
      })
  
      this.getSimplePost();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})