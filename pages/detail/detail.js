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
    wx.downloadFile({
      url: event.currentTarget.dataset.url,
      success: (res) => {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: (res) => {
            const savedFilePath = res.savedFilePath
            this.setData({
              fileSaveInfo: `文件成功保存到${savedFilePath}`
            });
          }
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
          body: postObj.body,
          category: postObj.category.name,
          createdAt: postObj.createdAt,
          postImage: postObj.postImage.url,
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