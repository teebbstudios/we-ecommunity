// app.js
import wxRequest from 'wechat-request';
import {
  ApiConfig,
  CommunityApi,
  RelationApi,
  ReservationTypeApi,
  SuggestionTypeApi
} from './config/api';

function abc(){
  console.log(abc)
}

App({
  globalData: {},

  getCommuntiies: function () {
    wxRequest.get(CommunityApi.getCollection).then(response => {
      wx.setStorage({key:'communities',data: response.data['hydra:member']});
    })
  },

  getRelationWithHost: function(){
    let hostParams = {
      type: 'host'
    }
    wxRequest.get(RelationApi.getCollection,{params: hostParams}).then(response => {
      wx.setStorage({key:'relationsWithHost',data: response.data['hydra:member']});
    })
  },

  getRelationWithRoom: function(){
    let hostParams = {
      type: 'room'
    }
    wxRequest.get(RelationApi.getCollection,{params: hostParams}).then(response => {
      wx.setStorage({key:'relationsWithRoom',data: response.data['hydra:member']});
    })
  },

  getReservationTypes:function(){
    wxRequest.get(ReservationTypeApi.getCollection).then(response=>{
      wx.setStorage({key:'reservationTypes', data: response.data['hydra:member']});
    });
  },

  getSuggestionTypes: function(){
    wxRequest.get(SuggestionTypeApi.getCollection).then(response=>{
      wx.setStorage({key:'suggestionTypes', data: response.data['hydra:member']});
    });
  },

  onLaunch() {
    //检查版本更新
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })


    //wxRequest全局配置
    wxRequest.defaults.baseURL = ApiConfig.apiHost;
    wxRequest.defaults.headers.common.Accept = ApiConfig.accept + wxRequest.defaults.headers.common.Accept;
    wxRequest.defaults.headers.get['Content-Type'] = ApiConfig.contentType;
    wxRequest.defaults.headers.post['Content-Type'] = ApiConfig.contentType;
    wxRequest.defaults.headers.put['Content-Type'] = ApiConfig.contentType;
    wxRequest.defaults.headers.patch['Content-Type'] = ApiConfig.patchContentType;
    //检查token是否过期
    let expireAt = wx.getStorageSync('expireAt') * 1;
    if(new Date() > new Date(expireAt)){
      wx.removeStorage({key: 'authToken'});
      wx.removeStorage({key: 'userInfo'});
      wx.removeStorage({key: 'userId'});
      wx.removeStorage({key: 'familyId'});
    }

    //如果已经登录，添加Authentication
    wx.getStorage({
      key: 'authToken',
      success(res) {
        wxRequest.defaults.headers['Authorization'] = 'Bearer ' + res.data;
      }
    })

    //启动小程序时，获取常用信息，并设置到存储中
    this.getCommuntiies();
    this.getRelationWithHost();
    this.getRelationWithRoom();
    this.getReservationTypes();
    this.getSuggestionTypes();

    // 获取系统状态栏信息
    // wx.getSystemInfo({
    //   success: e => {
    //     console.log(e);
    //     this.globalData.StatusBar = e.statusBarHeight;
    //     let capsule = wx.getMenuButtonBoundingClientRect();
    //     if (capsule) {
    //       this.globalData.Custom = capsule;
    //       this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
    //     } else {
    //       this.globalData.CustomBar = e.statusBarHeight + 50;
    //     }
    //   }
    // })
  }

})