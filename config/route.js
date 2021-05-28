import wxRequest from "wechat-request";

export const Routes = {
  index: "/pages/index/index",
  interactive: "/pages/interactive/detail",
  register: "/pages/register/register",
  sosConfirm: "/pages/sos-confirm/confirm",
  family: "/pages/family/family",
  interactiveList: "/pages/interactives/list",
  sos: "/pages/sos/sos",
  qrcode: "/pages/qrcode/qrcode",
  mine: "/pages/mine/mine",
  search: "/pages/search/search",
  postDetail: "/pages/detail/detail",
  idcardBack: "/pages/backidcard/back",
  selfie: "/pages/selfie/selfie",
  idcardFront: "/pages/frontidcard/front",
  reservation: "/pages/reservation/reservation",
  suggestion: "/pages/suggestion/suggestion",
  postList: "/pages/list/list",
  profile: "/pages/profile/profile",
  subscriber: "/pages/subscriber/subscriber",
  
  navTo: function (api, params) {
    wx.navigateTo({
      url: api + params,
    })
  },

  checkJwtExpired: function (response) {
    if (response.data.code === 401 && response.data.message === 'Expired JWT Token') {
      wx.showModal({
        title: '您的账号已超时请重新登录',
        success: res => {
          if (res.confirm) {
            wx.reLaunch({
              url: this.mine,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

      delete wxRequest.defaults.headers['Authorization'];

      wx.removeStorage({
        key: 'userInfo',
      });
      wx.removeStorage({
        key: 'authToken',
      });
    }
  }
}