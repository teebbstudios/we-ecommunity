// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //用于关键词回显
    keywords: {
      type: String,
      value: ''
    },
    // 搜索某个分类下的内容
    category: {
      type: String,
      value: ''
    },
    // 当前分类名称
    listName: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cancelShow: false,
    keywords: '',
    listName: ''
  },
  lifetimes: {
    attached: function () {
      if(this.data.keywords !==""){
        this.setData({
          cancelShow: true
        });
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onFocus: function () {
      this.setData({
        cancelShow: true
      });
    },
    search: function (event) {
      console.log(event);
    },
    reset: function () {
      this.setData({
        keywords: '',
        cancelShow: false
      });
    }
  }
})