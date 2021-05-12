import wxRequest from "wechat-request";
import {
  FamilyApi
} from "../../config/api";
import {
  Routes
} from "../../config/route";

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
    areas: [],
    areaId: null,
    areaIndex: null,
    buildings: [],
    buildingId: null,
    buildingIndex: null,
    units: [],
    unitId: null,
    unitIndex: null,
    rooms: [],
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
    relationsWithHost: [],
    relationsWithHostId: null,
    relationsWithHostIndex: null,
    relationsWithRoom: [],
    relationsWithRoomId: null,
    relationsWithRoomIndex: null,
    familyId: null,
  },
  radioChange: function (e) {
    this.setData({
      typeDescription: this.data.types[e.detail.value].description,
      type: e.detail.value,
    });
  },
  replaceStr: (str, index, char) => {
    return str.substring(0, index) + char + str.substring(index + 1);
  },
  numSteps: function (e) {
    let btnType = e.currentTarget.id;
    let currentStep = this.data.num;

    if (btnType === 'prev') {
      currentStep <= 0 ? 0 : currentStep -= 1;
    }
    if (btnType === 'next') {
      currentStep += 1;
    }

    //根据当前页面，对按钮添加额外方法
    switch (currentStep) {
      case 1: //第一步
        this.setData({
          num: currentStep
        })
        break;
      case 2: //选择住址
        //在这一步查找或创建家庭
        if (!this.data.areaId || !this.data.buildingId || !this.data.unitId || !this.data.roomId || !this.data.relationsWithRoomId) {
          wx.showToast({
            icon: 'error',
            title: '请补充完整信息',
          })
          return;
        }

        //查找当前家庭，如果当前家庭不存在，创建家庭，如果存在选择当前家庭
        let findFamilyParams = {
          "community.id": this.data.areas[this.data.areaIndex].id,
          "building.id": this.data.buildings[this.data.buildingIndex].id,
          "unit.id": this.data.units[this.data.unitIndex].id,
          "room.id": this.data.rooms[this.data.roomIndex].id,
        }
        wxRequest.get(FamilyApi.getCollection, {
          params: findFamilyParams
        }).then(response => {
          Routes.checkJwtExpired(response);

          let families = response.data['hydra:member'];
          if (families.length > 1) {
            wx.showToast({
              icon: 'error',
              title: '系统错误',
            })

          }

          if (families.length == 1) {
            let residents = families[0].residents;
            let residentsName = '';
            residents.map(item => {
              residentsName = residentsName + this.replaceStr(item.name, 1, '*') + ' ';
            })
            wx.showModal({
              title: '当前家庭已存在，是否加入？',
              content: residents.length === 0 ? '' : ('已有成员：' + residentsName),
              success: res => {
                if (res.confirm) {
                  this.setData({
                    num: currentStep,
                    familyId: families[0]['@id']
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          if (families.length == 0) {
            //创建家庭
            let postParams = {
              community: this.data.areaId,
              building: this.data.buildingId,
              unit: this.data.unitId,
              room: this.data.roomId
            }
            wxRequest.post(FamilyApi.postCollection, postParams).then(response => {
              
              if(response.status === 201){
                wx.showToast({
                  icon: 'success',
                  title: '家庭创建成功',
                })

                this.setData({
                  num: currentStep,
                  familyId: response.data['@id']
                })
              }
            })
          }
        })
        break;
      case 3: //填写信息
        //todo：信息完整性检查
        break;
      case 4: //登记完成
        break;
    }

  },
  pickerChange: function (e) {
    let pickerType = e.currentTarget.id;
    let pickIndex = e.detail.value;
    switch (pickerType) {
      case "area":
        this.setData({
          areaIndex: pickIndex,
          areaId: this.data.areas[pickIndex]['@id'],
          buildings: this.data.areas[pickIndex].builds,
          units: this.data.areas[pickIndex].units,
          rooms: this.data.areas[pickIndex].rooms,
        })
        break;
      case "building":
        this.setData({
          buildingIndex: pickIndex,
          buildingId: this.data.buildings[pickIndex]['@id']
        })
        break;
      case "unit":
        this.setData({
          unitIndex: pickIndex,
          unitId: this.data.units[pickIndex]['@id']
        })
        break;
      case "room":
        this.setData({
          roomIndex: pickIndex,
          roomId: this.data.rooms[pickIndex]['@id']
        })
        break;
      case "relationsWithRoom":
        this.setData({
          relationsWithRoomIndex: pickIndex,
          relationsWithRoomId: this.data.relationsWithRoom[pickIndex]['@id']
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
          url: Routes.selfie,
        })
        break;
      case "idcardback":
        wx.navigateTo({
          url: Routes.idcardBack,
        })
        break;
      case "idcardfront":
        wx.navigateTo({
          url: Routes.idcardFront,
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
    let communities = wx.getStorageSync('communities');
    let relationsWithRoom = wx.getStorageSync('relationsWithRoom');
    let relationsWithHost = wx.getStorageSync('relationsWithHost');

    this.setData({
      areas: communities,
      relationsWithRoom,
      relationsWithHost
    })

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