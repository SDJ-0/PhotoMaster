import React, { Component } from 'react'
import { Icon, ScrollView, View } from '@tarojs/components'
import Taro, { getStorageSync, render } from '@tarojs/taro';
import { ClTabs, ClButton, ClFlex, ClCard, ClText, ClIcon, ClModal, ClFloatButton, ClAvatar, ClGrid } from "mp-colorui";
import { AtCard, AtDrawer, AtImagePicker, AtTabs, AtTabsPane } from 'taro-ui';
import './index.scss'
import { ChooseTemplate } from './template'
import { ChooseUserImage } from './userimage'
import { Start } from './start'
import { Help } from './help'

// 选择用户图像

function initialize() {
  const memory_name = ['userImagePath', 'templateID', 'templatePath']
  memory_name.map((item) => {
    Taro.getStorage({
      key: item,
      fail: () => Taro.setStorage({ key: item, data: null })
    })
  })
}

function getAuthorize() {
  Taro.getSetting({
    success: function (res) {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum',
          success: () => {
            Taro.showToast({
              title: '授权成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
      if (!res.authSetting['scope.userInfo']) {
        Taro.authorize({
          scope: 'scope.userInfo',
          success: () => {
            Taro.showToast({
              title: '授权成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    }
  })
}

function getUserInfomation() {
  Taro.getStorage({
    key: 'userName',
    fail: () => Taro.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        Taro.setStorage({ key: 'userName', data: nickName })
        console.log('get user info success')
        console.log(res)
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  })


  Taro.login({
    success(res) {
      if (res.code) {
        //发起网络请求
        Taro.request({
          url: 'http://127.0.0.1:8000/login/',
          data: {
            code: res.code
          },
          success: (res1) => {
            Taro.getUserInfo({
              success: function (res2) {
                Taro.request({
                  url: 'http://127.0.0.1:8000/login/',
                  data: {
                    iv: res2.iv,
                    ed: res2.encryptedData,
                    session_key: res1.data
                  },
                  success: (res3) => {
                    Taro.setStorage({ key: 'userID', data: res3.code })
                    Taro.showToast({ title: '登陆成功！', icon: "success" })
                  }
                })
              },
              fail: () => {
                Taro.showToast({
                  title: '获取用户信息失败',
                  icon: 'none'
                })
                getAuthorize()
              }
            })
          },
          fail: () => {
            Taro.setStorage({ key: 'userID', data: null })
            Taro.showToast({ title: '登陆失败！', icon: "none" })
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}


// 获取用户模板信息
export function getPrivateTemplate() {
  Taro.request({
    url: 'http://127.0.0.1:8000/usertemplate/',
    data: { userID: Taro.getStorageSync('userID') },
    method: "GET",
    dataType: 'json',
    success: function (res) {
      if (res.statusCode === 200) {
        var ps = [new Promise((resolve, reject) => { })];
        ps.pop();
        let info = [];
        for (var i = 0; i < res.data.length; i++) {
          var parse = {};
          var item = res.data[i];
          parse['templateID'] = item.pk;
          parse['templateName'] = item.fields.name;
          parse['authorName'] = item.fields.user_nickname;
          parse['templateDesc'] = item.fields.desc;
          parse['templateURL'] = item.fields.pic_path;
          parse['templateState'] = item.fields.is_available;
          info.push(parse);
        }
        let memory = [];
        info.array.forEach(element => {
          ps.push(new Promise((resolve, reject) => {
            let tmp = element
            Taro.downloadFile({
              url: element['templateURL'],
              success: function (res) {
                if (res.statusCode === 200) {
                  tmp['templatePath'] = res.tempFilePath;
                  memory.push(tmp);
                  resolve('success');
                }
                else {
                  reject('fail to download private picture');
                }
              },
              fail: () => { reject('fail to get private url') }
            })
          }))
        });
        Promise.all(ps).then(values => { Taro.setStorage({ key: 'privateTemplateInfo', data: memory }) })
          .catch(reason => { console.log(reason) })
      }
    },
    fail: () => { Taro.showToast({ title: '获取用户模板信息失败', icon: 'none' }) }
  })
}

// 获取公共模板信息
export function getPublicTemplate() {
  Taro.request({
    url: 'http://127.0.0.1:8000/template/',
    dataType: 'json',
    method: "GET",
    success: function (res) {
      console.log(res);
      if (res.statusCode === 200) {
        var ps = [new Promise((resolve, reject) => { })];
        ps.pop();
        let info = [];
        for (var i = 0; i < res.data.length; i++) {
          var parse = {};
          var item = res.data[i];
          parse['templateID'] = item.pk;
          parse['templateName'] = item.fields.name;
          parse['authorName'] = item.fields.user_nickname;
          parse['templateDesc'] = item.fields.desc;
          parse['templateURL'] = item.fields.pic_path;
          parse['templateState'] = item.fields.is_available;
          info.push(parse);
        }
        console.log(info);
        let memory = [];
        info.forEach(element => {
          ps.push(new Promise((resolve, reject) => {
            let tmp = element
            Taro.downloadFile({
              url: element['templateURL'],
              success: function (res) {
                if (res.statusCode === 200) {
                  tmp['templatePath'] = res.tempFilePath;
                  memory.push(tmp);
                  resolve('success');
                }
                else {
                  reject('fail to download public picture');
                }
              },
              fail: () => { reject('fail to get public url') }
            })
          }))
        });
        Promise.all(ps).then(values => { Taro.setStorage({ key: 'publicTemplateInfo', data: memory }) })
          .catch(reason => { console.log(reason) })
      }
    },
    fail: () => { Taro.showToast({ title: '获取公共模板信息失败', icon: 'none' }) }
  })
}

export default class Index extends Component {

  constructor(props) {
    super(props);
  }

  onLaunch() {
    getAuthorize()

    getUserInfomation()

    initialize()



    const res = Taro.getSystemInfoSync()
    Taro.setStorage({ key: 'width', data: res.windowWidth })
    Taro.setStorage({ key: 'height', data: res.windowHeight })
    Taro.setStorage({ key: 'publucTemplateInfo', data: [] })
    Taro.setStorage({ key: 'privateTemplateInfo', data: [] })
  }

  componentDidShow() {
    getAuthorize()
    const res = Taro.getSystemInfoSync()
    Taro.setStorage({ key: 'width', data: res.windowWidth })
    Taro.setStorage({ key: 'height', data: res.windowHeight })

    initialize()
    getUserInfomation()

    // getPrivateTemplate()

    getPublicTemplate()
  }

  setUserImage(res, path) {
    console.log(res, path)
    this.setState({ userImagePath: path })
  }

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'PhotoMaster',
      path: '/page/user?id=123'
    }
  }

  onShareTimeline() {
    console.log('onShareTimeline')
    return {}
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidHide() { }


  render() {
    return (
      <View className='background-view'>
        <Help />
        <View className='image-box at-row at-row__justify--center at-row__align--center'>\
            <View className="center">
            <ChooseUserImage />
          </View>
        </View>
        <View className='bottom-box'>
          <ChooseTemplate />
          <Start />
        </View>
      </View>

    )
  }
}

