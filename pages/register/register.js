// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      house: null, //家庭地址
      name: null, //姓名
      sex: null, //性别
      birthday: null, //生日
      age: null, //年龄
      nation: null, //民族
      selfie: null, //自拍
      idcardFront: null, //身份证国徽面
      idcardBack: null, //身份证人像面
      idcardNo: null, //身份证号码
      phone: null, //联系电话
      education: null, //学历
      marriage: null, //婚姻情况
      political: null, //政治面貌
      address: null, //证件地址
      employer: null, //工作单位
    },
    //所选择的登记类型，0：为自己登记，1：代他人登记
    type: 0,
    //登记类型提示
    typeDescription: '如果您是首次登记，请先为自己登记信息。',
    types: [{
        value: 0,
        name: '为自己登记',
        checked: 'true',
        description: '如果您是首次登记，请先为自己登记信息。'
      },
      {
        value: 1,
        name: '代他人登记',
        description: '代他人登记之前，请先为自己登记信息。仅允许登记相同户号的他人信息。'
      }
    ],
    numList: [{
      name: '登记类型'
    }, {
      name: '选择住址'
    }, {
      name: '填写信息'
    }, {
      name: '登记完成'
    }, ],
    num: 0,
    areas: [{
        id: 1,
        name: "康乐社区"
      },
      {
        id: 2,
        name: "紫金花园"
      },
      {
        id: 3,
        name: "博泰花园"
      }
    ],
    areaId: null,
    areaIndex: null,
    buildings: [{
        id: 1,
        label: "#1"
      },
      {
        id: 2,
        label: "#2"
      },
      {
        id: 3,
        label: "#3"
      },
      {
        id: 4,
        label: "#4"
      },
    ],
    buildingId: null,
    buildingIndex: null,
    rooms: [{
        id: 1,
        label: "#101"
      },
      {
        id: 2,
        label: "#102"
      },
      {
        id: 3,
        label: "#201"
      },
      {
        id: 4,
        label: "#202"
      },
    ],
    roomId: null,
    roomIndex: null,
    imgList: [],
    //自拍照
    selfieTmp: null,
    //身份证人像面
    idcardBackTmp: null,
    //身份证国徽面
    idcardFrontTmp: null,

    sexs: ['男', '女'],
    sexIndex: 0,
    marriages: ['单身', '已婚', '离异', '丧偶', '其他'],
    
    marriageIndex: null,
    politicals: ['中共党员', '中共预备党员', '共青团员', '群众', '民革党员', '民盟盟员', '民建会员', '民进会员', '农工党党员', '致公党党员', '九三学社社员', '台盟盟员', '无党派人士'],
    
    politicalIndex: null,
    educations: ['小学', '初中', '高中', '大专', '本科', '硕士', '博士', '无学历'],
    
    educationIndex: null,
    relations: [
      {id: 1, label: '户主'},
      {id: 2, label: '父亲'},
      {id: 3, label: '母亲'},
    ]
  },
  radioChange: function (e) {
    this.setData({
      typeDescription: this.data.types[e.detail.value].description
    });
  },
  numSteps: function (e) {
    let btnType = e.currentTarget.id;
    let currentStep = this.data.num;
    console.log(currentStep)
    if (btnType === 'prev') {
      currentStep <= 0 ? 0 : currentStep -= 1;
    }
    if (btnType === 'next') {
      currentStep += 1;
    }
    this.setData({
      num: currentStep
    })
  },
  pickerChange: function (e) {
    console.log(e);
    let pickerType = e.currentTarget.id;
    let pickIndex = e.detail.value;
    switch (pickerType) {
      case "area":
        this.setData({
          areaIndex: pickIndex,
          areaId: this.data.areas[pickIndex].id
        })
        break;
      case "building":
        this.setData({
          buildingIndex: pickIndex,
          buildingId: this.data.buildings[pickIndex].id
        })
        break;
      case "room":
        this.setData({
          roomIndex: pickIndex,
          roomId: this.data.rooms[pickIndex].id
        })
        break;
      case "sex":
        this.setData({
          sexIndex: pickIndex,
          sex: this.data.sexs[pickIndex]
        });
        break;
      case "marriage":
        this.setData({
          marriageIndex: pickIndex,
          marriage: this.data.marriages[pickIndex]
        });
        break;
      case "political":
        this.setData({
          politicalIndex: pickIndex,
          political: this.data.politicals[pickIndex]
        });
        break;
      case "education":
        this.setData({
          educationIndex: pickIndex,
          education: this.data.educations[pickIndex]
        });
        break;
    }
  },
  dateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  goCamera: function (e) {
    let cameraType = e.currentTarget.id;
    switch (cameraType) {
      case "selfie":
        wx.navigateTo({
          url: '/pages/selfie/selfie',
        })
        break;
      case "idcardback":
        wx.navigateTo({
          url: '/pages/backidcard/back',
        })
        break;
      case "idcardfront":
        wx.navigateTo({
          url: '/pages/frontidcard/front',
        })
        break;
    }
  },

  getPhoneNumber: function (e) {
    console.log(e);
  },

  getChoosePoi: (e) => {
    wx.choosePoi(e)({
      success: (e) => {
        console.log(e);
      }
    })
  },

  //验证是否授权打开地图权限
  getLocation: function () {
    wx.getSetting({
      success: (res) => {
        // 判断定位的授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              this.onGetLocation();
            },
            fail(errMsg) {
              wx.showToast({
                title: JSON.stringify(errMsg),
                icon: 'none'
              })
            }
          })
        } else {
          this.onGetLocation();
        }
      }
    })
  },

  //打开地图获取位置
  onGetLocation: function (e) {
    wx.chooseLocation({
      success: (result) => {
        console.log(result);
        this.setData({
          address: result.address + result.name
        })
      },
      fail: (e) => {},
      complete: () => {}
    });
  },

  submit: function (e) {

  },

  forbid: function (e) {

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