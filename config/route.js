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
  
  navTo: function(api, params){
    wx.navigateTo({
      url: api + params,
    })
  }
}