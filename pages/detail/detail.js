// pages/detail/detail.js
import wxRequest from "wechat-request";
import {
  PostApi,
  FileApi
} from "../../config/api";
import {
  Routes
} from "../../config/route";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileSaveInfo: false,
    post: {
      id: '',
      title: '',
      body: '',
      category: '',
      createdAt: '',
      postImage: '',
      attachments: [],
      attachImages: [],
      attachFiles: []
    }
  },

  downloadFile: function (event) {
    wx.showLoading({
      title: '正在加载附件中',
    })
    wx.downloadFile({
      url: event.currentTarget.dataset.url,
      success: (res) => {
        wx.hideLoading();
        wx.openDocument({
          filePath: res.tempFilePath
        })
      }
    })
  },
  previewImage: function (event) {
    wx.previewImage({
      current: event.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.post.attachImages
    })
  },
  /**
   * 处理富文本里的图片宽度自适应
   * 1.去掉img标签里的style、width、height属性
   * 2.img标签添加style属性：max-width:100%;height:auto
   * 3.修改所有style里的width属性为max-width:100%
   * 4.去掉标签
   */
  formatRichText: function (html) {
    let newContent = html.replace(/\<img/gi, '<img class="rich-img radius shadow"');
    return newContent;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    wxRequest.get(PostApi.getItem(id)).then(response => {
      let postObj = response.data;
      let attachments = [],
        attachImages = [],
        attachFiles = [];

      postObj.attachments['hydra:member'].map(item => {
        let attachment = {
          id: item.id,
          originName: item.originName,
          url: item.url,
          mimeType: item.mimeType
        }
        if (-1 !== attachment.mimeType.indexOf('image/')) {
          attachImages.push(attachment.url);
        } else {
          attachFiles.push(attachment);
        }
        attachments.push(attachment);
      });
      this.setData({
        post: {
          id: postObj.id,
          title: postObj.title,
          body: this.formatRichText(postObj.body),
          category: postObj.category.name,
          createdAt: postObj.createdAt,
          postImage: postObj.postImage ? postObj.postImage.url : null,
          attachments: attachments,
          attachImages: attachImages,
          attachFiles: attachFiles
        }
      });
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