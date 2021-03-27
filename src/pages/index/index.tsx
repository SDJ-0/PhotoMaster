import React, { Component } from 'react'
import { ScrollView, View } from '@tarojs/components'
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
  const memory_name = ['userImagePath', 'templateType', 'templateIndex']
  memory_name.map((item) => {
    Taro.getStorage({
      key: item,
      fail: () => Taro.setStorage({ key: item, data: null })
    })
  })

}

export default class Index extends Component {

  constructor(props) {
    super(props);
  }


  onLaunch() {
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
      }
    })

    Taro.login({
      success(res) {
        if (res.code) {
          console.log('userID', res.code);
          Taro.setStorage({ key: 'userID', data: res.code })
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    })

    Taro.setStorage({ key: 'userImagePath', data: null })
    Taro.setStorage({ key: 'templateType', data: null })
    Taro.setStorage({ key: 'templateIndex', data: null })

    try {
      const res = Taro.getSystemInfoSync()
      Taro.setStorage({ key: 'width', data: res.windowWidth })
      Taro.setStorage({ key: 'height', data: res.windowHeight })
    } catch (e) {
      console.log(e)
    }
  }

  componentDidShow() {
    try {
      const res = Taro.getSystemInfoSync()
      Taro.setStorage({ key: 'width', data: res.windowWidth })
      Taro.setStorage({ key: 'height', data: res.windowHeight })
    } catch (e) {
      console.log(e)
    }

    Taro.getStorage({
      key: 'userID',
      fail: () => {
        Taro.login({
          success(res) {
            if (res.code) {
              console.log('userID', res.code);
              Taro.setStorage({ key: 'userID', data: res.code })
            } else {
              console.log("登录失败！" + res.errMsg);
            }
          }
        })
      }
    })

    initialize()

    // 获取模板信息
    // Taro.request({
    //   url: '',
    //   data: Taro.getStorageSync('userID'),
    //   dataType: 'json',
    //   success: function (res) {
    //     if (res.statusCode === 200) {
    //       Taro.setStorage({ key: 'publicImageUrl', data: res.data.publicTemplateUrl })
    //       Taro.setStorage({ key: 'privateImageUrl', data: res.data.privateTemplateUrl })
    //     }
    //   }
    // })

    // 提前下载模板
    // for (let i = 0; i < Taro.getStorageSync('publicTemplateNum'); i++) {
    //   Taro.getStorageSync('publicImageUrl').map(
    //     (index, url) => {
    //       Taro.downloadFile({
    //         url: url,
    //         success: function (res) {
    //           if (res.statusCode === 200) {
    //             Taro.setStorage({ key: 'publicTemplate' + String(index), data: res.filePath })
    //           }
    //         }
    //       })
    //     }
    //   )
    // }
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

