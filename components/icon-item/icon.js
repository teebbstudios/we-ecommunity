// components/icon-item/icon.js
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
    route:{
      type: String,
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
    navTo: function(event){
      wx.navigateTo({
        url: event.currentTarget.dataset.route,
      })
    }
  }
})
