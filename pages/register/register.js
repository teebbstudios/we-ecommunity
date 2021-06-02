import wxRequest from "wechat-request";
import {
  ApiConfig,
  FamilyApi,
  FileApi,
  UserApi,
  FileUploader,
  ResidentApi
} from "../../config/api";
import {
  Routes
} from "../../config/route";
import {
  MsgTemplates
} from "../../config/templates";

// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoUpdate: false,
    selfieUpdate: false,
    idcardBackUpdate: false,
    idcardFrontUpdate: false,
    familyUpdate: false,
    info: {
      createType: 0, //所选择的登记类型，0：为自己登记，1：代他人登记
      house: null, //家庭地址
      name: null, //姓名
      sex: null, //性别
      birthday: null, //生日
      age: null, //年龄
      nationality: null, //民族
      selfie: null, //自拍
      selfieTmp: null, //自拍临时文件
      //身份证人像面
      idcardBackTmp: null,
      //身份证国徽面
      idcardFrontTmp: null,
      idcardFront: null, //身份证国徽面
      idcardBack: null, //身份证人像面
      idcard: null, //身份证号码
      phone: null, //联系电话
      education: null, //学历
      marriage: null, //婚姻情况
      politics: null, //政治面貌
      address: null, //证件地址
      employer: null, //工作单位
      family: null, //家庭iri
      relationWithHost: null, //与户主关系iri
      relationsWithHostName: null, //与户主关系名称
      relationWithRoom: null, //与房产关系
      relationsWithRoomName: null, //与房产关系
    },

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
        description: '代他人登记之前，请先为自己登记信息。仅允许登记相同户号的家人信息。'
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
    community: null,
    buildings: [],
    buildingId: null,
    buildingIndex: null,
    building: null,
    units: [],
    unitId: null,
    unitIndex: null,
    unit: null,
    rooms: [],
    roomId: null,
    roomIndex: null,
    room: null,
    imgList: [],

    sexs: ['男', '女'],
    sexIndex: 0,

    marriages: ['单身', '已婚', '离异', '再婚', '丧偶', '其他'],
    marriageIndex: null,

    politicals: ['群众', '中共党员', '中共预备党员', '共青团员', '民革党员', '民盟盟员', '民建会员', '民进会员', '农工党党员', '致公党党员', '九三学社社员', '台盟盟员', '无党派人士'],
    politicalIndex: null,

    educations: ['小学', '初中', '高中', '大专', '本科', '硕士', '博士', '无学历'],
    educationIndex: null,

    relationsWithHost: [],
    relationsWithHostIndex: null,

    relationsWithRoom: [],
    relationsWithRoomIndex: null,

    //通知设置
    tmplIds: [MsgTemplates.notification, MsgTemplates.activity, MsgTemplates.check_result],

    //生日选择器最大日期
    today: null,
  },

  formatDate: function (date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
  },
  getInputValue: function (e) {
    let key = e.currentTarget.id
    let info = this.data.info;
    info[key] = e.detail.value;
    this.setData({
      info
    })
  },
  radioChange: function (e) {
    //如果选择代他人登记，清除数据
    if(e.detail.value == 1){
      this.setData({
        info: {
          createType: 1, //所选择的登记类型，0：为自己登记，1：代他人登记
          house: null, //家庭地址
          name: null, //姓名
          sex: null, //性别
          birthday: null, //生日
          age: null, //年龄
          nationality: null, //民族
          selfie: null, //自拍
          selfieTmp: null, //自拍临时文件
          //身份证人像面
          idcardBackTmp: null,
          //身份证国徽面
          idcardFrontTmp: null,
          idcardFront: null, //身份证国徽面
          idcardBack: null, //身份证人像面
          idcard: null, //身份证号码
          phone: null, //联系电话
          education: null, //学历
          marriage: null, //婚姻情况
          politics: null, //政治面貌
          address: null, //证件地址
          employer: null, //工作单位
          family: null, //家庭iri
          relationWithHost: null, //与户主关系iri
          relationsWithHostName: null, //与户主关系名称
          relationWithRoom: null, //与房产关系
          relationsWithRoomName: null, //与房产关系
        },
        infoUpdate: false,
      })
    }

    this.setData({
      typeDescription: this.data.types[e.detail.value].description,
      "info.createType": e.detail.value * 1,
    });
  },
  replaceStr: (str, index, char) => {
    return str.substring(0, index) + char + str.substring(index + 1);
  },
  getRelationIri: (relations, id) => {
    let ralationIri = null;
    relations.map(item => {
      if (item.id == id) {
        ralationIri = item['@id'];
      }
    })
    return ralationIri;
  },
  numSteps: function (e) {
    let btnType = e.currentTarget.id;
    let currentStep = this.data.num;

    if (btnType === 'prev') {
      currentStep <= 0 ? 0 : currentStep -= 1;
      this.setData({
        num: currentStep
      })
    }
    if (btnType === 'next') {
      currentStep += 1;

      //根据当前页面，对按钮添加额外方法
      switch (currentStep) {
        case 1: //第一步
          if (this.data.info.createType == 0) {
            wx.showLoading({
              title: '正在加载中',
            })
            //如果自己已经登记过，那么弹出提示。
            let params = {
              "owner.id": wx.getStorageSync('userId')
            }
            wxRequest.get(ResidentApi.getCollection, {
              params
            }).then(response => {
              wx.hideLoading();
              if (response.data["hydra:member"].length > 0) {
                wx.showModal({
                  title: '您已登记过信息',
                  content: '您已登记过信息，点击确定将修改信息，点击取消可以选择代他人登记信息。',
                  success: (res) => {
                    let resident = response.data["hydra:member"][0];
                    if (res.confirm) {
                      //获取小区信息
                      wxRequest.get(resident.family).then(response => {
                        let family = response.data;

                        this.data.areas.map(item => {
                          if (item['@id'] == family.community['@id']) {
                            this.setData({
                              buildings: item.builds,
                              units: item.units,
                              rooms: item.rooms,
                            })
                          }
                        });

                        this.setData({
                          infoUpdate: true,
                          num: currentStep,
                          areaId: family.community['@id'],
                          community: family.community,
                          buildingId: family.building['@id'],
                          building: family.building,
                          unitId: family.unit['@id'],
                          unit: family.unit,
                          roomId: family.room['@id'],
                          room: family.room,
                          info: resident,
                          "info.age": this.getAge(resident.birthday),
                          "info.house": family.community.name + family.building.buildingName + family.unit.unitName + family.room.roomNum,
                          "info.communityName": family.community.name,
                          "info.buildingName": family.building.buildingName,
                          "info.unitName": family.unit.unitName,
                          "info.roomNum": family.room.roomNum,
                          "info.selfieTmp": resident.selfieUrl,
                          "info.idcardBackTmp": resident.idcardBackUrl,
                          "info.idcardFrontTmp": resident.idcardFrontUrl,
                          "info.relationWithRoom": this.getRelationIri(this.data.relationsWithRoom, resident.relationWithRoom.id),
                          "info.relationWithRoomName": resident.relationWithRoom.name,
                          "info.relationWithHost": this.getRelationIri(this.data.relationsWithHost, resident.relationWithHost.id),
                          "info.relationWithHostName": resident.relationWithHost.name,
                        })
                      })
                    }
                  }
                })
              } else {
                this.setData({
                  num: currentStep
                })
              }
            })
          } else {
            this.setData({
              num: currentStep
            })
          }
          break;
        case 2: //选择住址
          //在这一步查找或创建家庭
          if (!this.data.areaId || !this.data.buildingId || !this.data.unitId || !this.data.roomId) {
            wx.showToast({
              icon: 'error',
              title: '请补充完整信息',
            })
            return;
          }

          //家庭信息变更时，重新查询数据
          if (this.data.familyUpdate) {
            wx.showLoading({
              title: '正在查询请稍候',
              mask: true
            });
            //查找当前家庭，如果当前家庭不存在，创建家庭，如果存在选择当前家庭
            let data = this.data;
            let community = data.community && !data.areaIndex ? data.community : data.areas[data.areaIndex];
            let building = data.building && !data.buildingIndex ? data.building : data.buildings[data.buildingIndex];
            let unit = data.unit && !data.unitIndex ? data.unit : data.units[data.unitIndex];
            let room = data.room && !data.roomIndex ? data.room : data.rooms[data.roomIndex];
            let findFamilyParams = {
              "community.id": community.id,
              "building.id": building.id,
              "unit.id": unit.id,
              "room.id": room.id,
            }

            this.setData({
              "info.house": community.name + building.buildingName + unit.unitName + room.roomNum
            })

            wxRequest.get(FamilyApi.getCollection, {
              params: findFamilyParams
            }).then(response => {
              wx.hideLoading();
              Routes.checkJwtExpired(response);

              let families = response.data['hydra:member'];
              if (families.length > 1) {
                wx.showToast({
                  icon: 'error',
                  title: '系统错误',
                })
                return;
              }

              if (families.length == 1) {
                //如果是为自己登记，创建家庭之后，设置familyId
                if (this.data.info.createType == 0) {
                  wx.setStorage({
                    key: 'familyId',
                    data: families[0].id
                  });
                }

                let residents = families[0].residents;
                if(!(residents instanceof Array)){
                  residents = Object.values(residents)
                }
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
                        "info.family": families[0]['@id']
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
                  if (response.status === 201) {
                    wx.showToast({
                      icon: 'success',
                      title: '家庭创建成功',
                    })
                    this.setData({
                      num: currentStep,
                      "info.family": response.data['@id']
                    })
                    //如果是为自己登记，创建家庭之后，设置familyId
                    if (this.data.info.createType == 0) {
                      wx.setStorage({
                        key: 'familyId',
                        data: response.data.id
                      });
                    }
                  }
                })
              }
            })
          } else {
            this.setData({
              num: currentStep
            })
          }
          break;
        case 3: //填写信息
          //检查信息是否完整
          let result = this.checkInfoComplete();
          if (-1 !== result) {
            this.setData({
              num: currentStep
            })
          }
          break;
        case 4: //登记完成
          break;
      }
    }


  },
  pickerChange: function (e) {
    let pickerType = e.currentTarget.id;
    let pickIndex = e.detail.value;
    switch (pickerType) {
      case "area":
        this.setData({
          familyUpdate: true,
          areaIndex: pickIndex,
          "info.communityName": this.data.areas[pickIndex].name,
          areaId: this.data.areas[pickIndex]['@id'],
          buildings: this.data.areas[pickIndex].builds,
          units: this.data.areas[pickIndex].units,
          rooms: this.data.areas[pickIndex].rooms,
        })
        break;
      case "building":
        this.setData({
          familyUpdate: true,
          buildingIndex: pickIndex,
          "info.buildingName": this.data.buildings[pickIndex].buildingName,
          buildingId: this.data.buildings[pickIndex]['@id'],
        })
        break;
      case "unit":
        this.setData({
          familyUpdate: true,
          unitIndex: pickIndex,
          "info.unitName": this.data.units[pickIndex].unitName,
          unitId: this.data.units[pickIndex]['@id']
        })
        break;
      case "room":
        this.setData({
          familyUpdate: true,
          roomIndex: pickIndex,
          "info.roomNum": this.data.rooms[pickIndex].roomNum,
          roomId: this.data.rooms[pickIndex]['@id']
        })
        break;
      case "relationsWithRoom":
        this.setData({
          relationsWithRoomIndex: pickIndex,
          "info.relationWithRoom": this.data.relationsWithRoom[pickIndex]['@id'],
          "info.relationWithRoomName": this.data.relationsWithRoom[pickIndex].name
        })
        break;
      case "sex":
        this.setData({
          sexIndex: pickIndex,
          "info.sex": this.data.sexs[pickIndex] === "男" ? 1 : 0
        });
        break;
      case "marriage":
        this.setData({
          marriageIndex: pickIndex,
          "info.marriage": this.data.marriages[pickIndex]
        });
        break;
      case "political":
        this.setData({
          politicalIndex: pickIndex,
          "info.politics": this.data.politicals[pickIndex]
        });
        break;
      case "education":
        this.setData({
          educationIndex: pickIndex,
          "info.education": this.data.educations[pickIndex]
        });
        break;
      case "relationsWithHost":
        this.setData({
          relationsWithHostIndex: pickIndex,
          "info.relationWithHost": this.data.relationsWithHost[pickIndex]['@id'],
          "info.relationWithHostName": this.data.relationsWithHost[pickIndex].name
        });
        break;
    }
  },

  getAge: function (birthday) {
    //出生时间 毫秒
    let birthDayTime = new Date(birthday).getTime();
    //当前时间 毫秒
    let nowTime = new Date().getTime();
    //一年毫秒数(365 * 86400000 = 31536000000)
    return Math.ceil((nowTime - birthDayTime) / 31536000000);
  },

  dateChange(e) {
    this.setData({
      "info.birthday": e.detail.value,
      "info.age": this.getAge(e.detail.value)
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
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    let errMsg = e.detail.errMsg;
    if (errMsg == 'getPhoneNumber:ok') {
      let userId = wx.getStorageSync('userId');
      let postConfig = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + wx.getStorageSync('authToken')
        }
      }
      wxRequest.post(UserApi.getItemPhone(userId), {
        iv,
        encryptedData
      }, postConfig).then(response => {
        if (response.status === 200) {
          let phone = response.data.phoneNumber;
          this.setData({
            "info.phone": phone
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: '获取手机号失败',
          })
        }

      })
    }
  },

  //检查住户信息是否完整
  checkInfoComplete: function () {
    let info = this.data.info;
    if (!info.selfieTmp || !info.idcardFrontTmp || !info.idcardBackTmp) {
      wx.showToast({
        icon: 'error',
        title: '请补充拍照信息',
      })
      return -1;
    }
    if (!info.name || !info.sex || !info.nationality || !info.education || !info.phone || !info.birthday || !info.idcard || !info.address || !info.marriage || !info.politics || !info.employer || !info.relationWithHost || !this.data.info.relationWithRoom) {
      wx.showToast({
        icon: 'error',
        title: '请补充完整信息',
      })
      return -1;
    }
    if (!(/^1[3456789]\d{9}$/.test(info.phone))) {
      wx.showToast({
        icon: 'error',
        title: '手机号格式错误',
      })
      return -1;
    }
    let idcardReg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
    if (!(idcardReg.test(info.idcard))) {
      wx.showToast({
        icon: 'error',
        title: '身份证格式错误',
      })
      return -1;
    }

  },

  getChoosePoi: (e) => {
    wx.choosePoi(e)({
      success: (e) => {
        this.setData({
          // "info.address": e.address
        })
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
        this.setData({
          "info.address": result.address
        })
      },
      fail: (e) => {},
      complete: () => {}
    });
  },

  uploadFile: function (params) {
    if (params.upload) {
      return FileUploader(params);
    }
  },

  uploadFilesFunc: function () {
    //上传照片，提交信息
    let headers = {
      "Content-Type": "multipart/form-data",
      "Accept": "application/ld+json, application/json",
      "Authorization": 'Bearer ' + wx.getStorageSync('authToken')
    }
    let selfieParams = {
      upload: this.data.selfieUpdate,
      filePath: this.data.info.selfieTmp,
      headers
    }
    let idcardBackParams = {
      upload: this.data.idcardBackUpdate,
      filePath: this.data.info.idcardBackTmp,
      headers
    }
    let idcardFrontParams = {
      upload: this.data.idcardFrontUpdate,
      filePath: this.data.info.idcardFrontTmp,
      headers
    }

    return wxRequest.all([
      this.uploadFile(selfieParams),
      this.uploadFile(idcardBackParams),
      this.uploadFile(idcardFrontParams),
    ]).then(response => {
      //selfie
      if (response[0] !== undefined) {
        let result = JSON.parse(response[0].data);
        this.setData({
          "info.selfie": result['@id']
        })
      }
      //idcardBack
      if (response[1] !== undefined) {
        let result = JSON.parse(response[1].data);
        this.setData({
          "info.idcardBack": result['@id']
        })
      }
      //idcardFront
      if (response[2] !== undefined) {
        let result = JSON.parse(response[2].data);
        this.setData({
          "info.idcardFront": result['@id']
        })
      }
    })
  },

  //提交资料
  submit: function (e) {
    wx.showLoading({
      title: '正在提交请稍候',
      mask: true
    })

    this.uploadFilesFunc().then(result => {
      if (this.data.infoUpdate) {
        //更新资料
        wxRequest.put(ResidentApi.patchItem(this.data.info.id), this.data.info).then(response => {
          wx.hideLoading();
          if (response.status === 200) {
            wx.showModal({
              title: '资料提交成功',
              content: '您的资料已提交成功，审核结果将以微信通知的方法告诉您。请您接受通知提醒。',
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  wx.requestSubscribeMessage({
                    tmplIds: this.data.tmplIds,
                    complete: res => {
                      wx.navigateBack();
                    }
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '资料提交失败',
              content: response.data['hydra:description'],
              showCancel: false
            })
          }
        });
      } else {
        //提交资料
        wxRequest.post(ResidentApi.postCollection, this.data.info).then(response => {
          wx.hideLoading();
          if (response.status === 201) {
            wx.setStorage({
              key: 'registered',
              data: true
            });
            wx.showModal({
              title: '资料提交成功',
              content: '您的资料已提交成功，审核结果将以微信通知的方法告诉您。请您接受通知提醒。',
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  wx.requestSubscribeMessage({
                    tmplIds: this.data.tmplIds,
                    complete: res => {
                      wx.navigateBack();
                    }
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '资料提交失败',
              content: response.data['hydra:description'],
              showCancel: false
            })
          }
        });
      }
    })
  },

  forbid: function (e) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showModal({
      title: '住户登记说明',
      content: '康乐e社区将收集您的信息用于住户管理及在线服务，用户隐私将遵守小程序服务条款“四、用户个人信息保护”及运营规范“15.用户隐私及数据规范”等规定进行保护。点击“同意”按钮继续登记信息。',
      confirmText: "同意",
      success: res => {
        if (res.cancel) {
          wx.navigateBack();
        }
      }
    })
    let communities = wx.getStorageSync('communities');
    let relationsWithRoom = wx.getStorageSync('relationsWithRoom');
    let relationsWithHost = wx.getStorageSync('relationsWithHost');

    this.setData({
      areas: communities,
      relationsWithRoom,
      relationsWithHost,
      today: this.formatDate(new Date())
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