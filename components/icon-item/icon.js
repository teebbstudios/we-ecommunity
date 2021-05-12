// components/icon-item/icon.js
import {
  Routes
} from "../../config/route";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
    },
    icon: {
      type: String,
    },
    route: {
      type: String,
    },
    needLogin: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navTo: function (event) {
      //当前页面是否需要登录
      let needLogin = event.currentTarget.dataset.login;
      let token = wx.getStorageSync('authToken');
      let userInfo = wx.getStorageSync('userInfo');
      
      if (needLogin && !token && !userInfo) {
        wx.showToast({
          icon: 'none',
          title: '请到我的页面登录后操作',
        })
      } else {
        wx.navigateTo({
          url: event.currentTarget.dataset.route,
        })
      }

    }
  }
})