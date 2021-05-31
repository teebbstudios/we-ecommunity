import { Routes } from "../../config/route";

// components/people-info/info.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: Object
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
    previewImage: (e) => {
      wx.previewImage({
        urls: [e.currentTarget.dataset.src]
      });
    },
    callPhone: (e) => {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone,
      })
    },
    bindWechat: (e) => {
      let residentId = e.currentTarget.dataset.residentid;
      let residentName = e.currentTarget.dataset.residentname;
      wx.navigateTo({
        url: Routes.qrcode + '?type=bindwechat&residentId='+residentId +'&residentName='+ residentName
      })
    }
  }
})