// components/post-item.js
import { Routes } from "../../config/route";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posts: {
      type: Array,
      value: []
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
    navToDetail: function (event) {
      let postId =event.currentTarget.id;
      Routes.navTo(Routes.postDetail, `?id=${postId}`);
    }
  }
})