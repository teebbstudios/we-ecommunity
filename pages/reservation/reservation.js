// pages/reservation/reservation.js
import wxRequest from "wechat-request";
import {
  FileUploader,
  ReservationApi
} from "../../config/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //预约办理的类型
    submitted: false,
    types: [],
    typeIndex: null,
    imgList: [],
    needUpload: false, //是否需要上传文件
    reservation: {
      reservationType: null,
      description: null,
      attachments: []
    }
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
      "reservation.description": e.detail.value
    })
  },
  pickerChange: function (e) {
    this.setData({
      typeIndex: e.detail.value,
      needUpload: this.data.types[e.detail.value].needupload,
      "reservation.reservationType": this.data.types[e.detail.value].iri
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let reservationTypes = wx.getStorageSync('reservationTypes');
    let types = [];
    reservationTypes.map(item => {
      let type = {
        iri: item['@id'],
        id: item.id,
        name: item.name,
        needupload: item.boolNeedUpload,
        description: item.description,
      }
      types.push(type);
    })
    this.setData({
      types
    })
  },

  submit: function () {
    if(this.data.submitted){
      wx.showToast({
        icon: 'error',
        title: '当前预约已提交',
      })
      return;
    }
    //上传图片资料，获取文件iri，设置到reservation
    if (!this.data.reservation.reservationType || !this.data.reservation.description) {
      wx.showToast({
        icon: 'error',
        title: '请补充完整信息',
      })
      return;
    }

    if (this.data.needUpload && this.data.imgList.length == 0) {
      wx.showToast({
        icon: 'error',
        title: '请上传资料图片',
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
            "reservation.attachments":attachementIris
          })
        }
      })
    }).then(res => {
      //提交预约
      wxRequest.post(ReservationApi.postCollection, this.data.reservation).then(response=>{
        wx.hideLoading()
        this.setData({
          submitted: true,
        })
        if(response.status === 201){
          wx.showModal({
            title: '您预约办理的业办已提交',
            content: '处理结果将会以微信通知的方式告知您，请您同意接收微信通知消息。',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                //todo: 此处弹出申请通知权限
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