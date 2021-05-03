// pages/reservation/reservation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //意见建议的类型
    types: [{
        id: 1,
        name: '社区管理',
        needupload: true, //是否需要上传图片
        description: '需提供户口本，身份证，医学证明'
      },
      {
        id: 2,
        name: '卫生建议',
        needupload: false,
        description: '需提供户口本，身份证，医学证明'
      },
      {
        id: 3,
        name: '123证明',
        needupload: false,
        description: '123需提供户口本，身份证，医学证明'
      },
      {
        id: 4,
        name: '234证明',
        needupload: false,
        description: '234需提供户口本，身份证，医学证明'
      },
      {
        id: 5,
        name: '345证明',
        needupload: false,
        description: '345需提供户口本，身份证，医学证明'
      },
    ],
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
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
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
  pickerChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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