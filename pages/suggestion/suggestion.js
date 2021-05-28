// pages/reservation/reservation.js
import wxRequest from "wechat-request";
import {
  FileUploader,
  ReservationApi,
  SuggestionApi
} from "../../config/api";
import { MsgTemplates } from "../../config/templates";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitted: false,
    suggestion: {
      suggestionType: null,
      description: null,
      attachments: []
    },
    //意见建议的类型
    types: [],
    typeIndex: null,
    imgList: [],
  },

  ChooseImage() {
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '要删除这个图片吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  changeDescription: function (e) {
    this.setData({
      "suggestion.description": e.detail.value
    })
  },
  pickerChange: function (e) {
    this.setData({
      typeIndex: e.detail.value,
      "suggestion.suggestionType": this.data.types[e.detail.value].iri
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let suggestionTypes = wx.getStorageSync('suggestionTypes');
    let types = [];
    suggestionTypes.map(item => {
      let type = {
        iri: item['@id'],
        id: item.id,
        name: item.name,
        description: item.description,
      }
      types.push(type);
    })
    this.setData({
      types
    })
  },

  submit: function(){
    if(this.data.submitted){
      wx.showToast({
        icon: 'error',
        title: '当前信息已提交',
      })
      return;
    }
    //上传图片资料，获取文件iri，设置到reservation
    if (!this.data.suggestion.suggestionType || !this.data.suggestion.description) {
      wx.showToast({
        icon: 'error',
        title: '请补充完整信息',
      })
      return;
    }

    wx.showLoading({
      title: '正在提交请稍候',
      mask: true
    })

    //上传照片，提交信息
    let headers = {
      "Content-Type": "multipart/form-data",
      "Accept": "application/ld+json, application/json",
      "Authorization": 'Bearer ' + wx.getStorageSync('authToken')
    }
    
    let uploadRequests = [];
    this.data.imgList.map(item=>{
      let uploadParams ={
        filePath:item,
        headers
      }
      uploadRequests.push(FileUploader(uploadParams));
    })

    wxRequest.all(uploadRequests).then(response => {
      let attachementIris = [];
      response.map(item=>{
        if(item.statusCode === 201){
          let data = JSON.parse(item.data);
          attachementIris.push(data['@id']);
          this.setData({
            "suggestion.attachments":attachementIris
          })
        }
      })
    }).then(res => {
      //提交意见和建议
      wxRequest.post(SuggestionApi.postCollection, this.data.suggestion).then(response=>{
        wx.hideLoading()
        this.setData({
          submitted: true,
        })
        if(response.status === 201){
          wx.showModal({
            title: '您的意见和建议已反馈',
            content: '处理结果将会以微信通知的方式告知您，请您同意接收微信通知消息。',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.requestSubscribeMessage({
                  tmplIds: [
                    MsgTemplates.suggestion_reply
                  ],
                  success: res => {
                    
                  },
                  complete: res=>{
                    wx.navigateBack();
                  }
                })
              }
            }
          })
        }
      })
    });
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