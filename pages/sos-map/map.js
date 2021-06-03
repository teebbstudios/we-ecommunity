// pages/sos-map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: null,
    longitude: null,
    markers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let latitude = options.latitude * 1;
    let longitude = options.longitude * 1;
    let marker = {
      id: 1,
      latitude,
      longitude,
      name: '求助人位置',
      callout: {
        content: '求助人位置',
        color: '#e54d42',
        display: 'ALWAYS',
      }
    }
    this.setData({
      latitude, 
      longitude,
      markers: [marker]
    })

    this.mapcontext = wx.createMapContext('sos-map');
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