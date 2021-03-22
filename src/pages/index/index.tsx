import React, { Component } from 'react'
import { ScrollView, View } from '@tarojs/components'
import Taro, { getStorageSync, render } from '@tarojs/taro';
import { ClTabs, ClButton, ClFlex, ClCard, ClText, ClIcon, ClModal, ClFloatButton, ClAvatar, ClGrid } from "mp-colorui";
import { AtCard, AtDrawer, AtImagePicker, AtTabs, AtTabsPane } from 'taro-ui';
import './index.scss'

// 选择用户图像
class ChooseUserImage extends Component {
  // 非UI方法
  // constructor(props) {
  //   super(props);
  //   this.state = { path: '' }
  // }
  // render() {
  //   let that = this
  //   return (
  //     <ClCard>
  //       <ClFlex justify='center' wrap={true}>
  //         <ClCard shadow={false} type='full'>
  //           <image src={that.state.path} mode='aspectFit'></image>
  //         </ClCard>
  //         <text/>
  //         <ClButton shape="round" size="large" bgColor='blue' plain
  //           onClick={
  //             () => Taro.chooseImage({
  //               count: 1,
  //               sizeType: ['original', 'compressed'],
  //               sourceType: ['album', 'camera'],
  //               success: function (res) { that.setState({ path: res.tempFilePaths }); console.log(that.state.path) }
  //             })
  //           } >选择你的图像</ClButton>
  //       </ClFlex>
  //     </ClCard>
  //   )
  // }

  constructor(props) {
    super(props)
    this.state = {
      files: [],
      showAdd: true
    }
  }

  onChange(files, operationType) {
    if (operationType == 'add') {
      this.setState({ showAdd: false })
      Taro.setStorage({ key: 'userImagePath', data: files[0]['url'] })
    }
    else if (operationType == 'remove') {
      this.setState({ showAdd: true })
      Taro.setStorage({ key: 'userImagePath', data: null })
    }
    this.setState({ files: files })
  }

  onFail(mes) {
    console.log(mes)
  }
  onImageClick(index, file) {
    console.log(index, file)
  }
  render() {
    return (
      // <View className='white-box'>
      <ClCard shadow={true} bgColor='white' >
        <AtImagePicker
          length={1}
          count={1}
          showAddBtn={this.state.showAdd}
          mode='aspectFit'
          files={this.state.files}
          onChange={this.onChange.bind(this)}
          onFail={this.onFail.bind(this)}
          onImageClick={this.onImageClick.bind(this)}
        />
      </ClCard>
      // </View >
    )
  }
}

class TempalteImg extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let publicTemplate = [<br />]
    publicTemplate.pop()
    let publicNum = Taro.getStorageSync('publicTemplateNum')
    // for (let i = 0; i < publicNum; i++) {
    //   publicTemplate.push(<image src={Taro.getStorageSync('publicTempalte' + String(i))}></image>)
    // }
    for (let i = 0; i < 5; i++) {
      publicTemplate.push(
        <View className='template-card'>
          <image
            src={Taro.getStorageSync('userImagePath')}
            mode='aspectFit'
            onClick={() => {
              Taro.setStorage({ key: 'templateType', data: 'public' })
              Taro.setStorage({ key: 'templateIndex', data: i })
              console.log('type', Taro.getStorageSync('templateType'))
              console.log('index', Taro.getStorageSync('templateIndex'))

            }}
          />
        </View>
      )
    }

    const scrollStyle = {
      height: String(Taro.getStorageSync('height') * 0.97) + 'px'
    }

    return (
      <ScrollView
        className='scroll-box'
        scrollY
        scrollWithAnimation
        style={scrollStyle}
      >
        <ClFlex wrap={true} justify="between">
          {publicTemplate}
        </ClFlex>
      </ScrollView>
    )
  }
}

class Templates extends Component {
  constructor(props) {
    super(props);
    this.state = { current: 0 }
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  // 更好看的界面，但是存在bug
  // render() {
  //   return (
  //     <ClCard type="full">
  //       <ClTabs type="center"
  //         tabs={[
  //           { text: "公用模板", icon: "round", id: "tab-1" },
  //           { text: "用户模板", icon: "favor", id: "tab-2" }
  //         ]}
  //       >
  //         <View key="tab-1" id="tab-1">1</View>
  //         <View key="tab-2" id="tab-2">2</View>
  //       </ClTabs>
  //     </ClCard>
  //   )

  render() {
    const tabList = [{ title: '公用模板' }, { title: '用户模板' }]
    return (
      <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
        <AtTabsPane current={this.state.current} index={0} >
          <View>
            <TempalteImg />
          </View>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
          <View>
            <TempalteImg />
          </View>
        </AtTabsPane>
      </AtTabs>
    )
  }
}

class ChooseTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
    Taro.setStorage({ key: 'userImagePath', data: null })
  }


  // 用户上传自定义模板
  uploadTemplate() {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      // success: function (res) {
      //   Taro.uploadFile({
      //     url: '',
      //     filePath: res.tempFilePaths[0],
      //     name: 'template',
      //     formData: {
      //       userID: Taro.getStorageSync('userID')
      //     }
      //   })
      // },
      fail: () => {
        return Taro.showToast({
          title: '取消上传',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

  render() {
    return (
      <ClCard type="full" shadow={false} bgColor='#f7ecdc'>
        <View className="chooseButton-box">
          {/* <ClFlex justify="between"> */}
          <View className='at-row at-row__justify--around at-row__align--center' >
            {/* <ClCard type="full" bgColor='#f7ecdc'> */}
            <View className='at-col at-col-5'>
              <ClFlex justify='center'>
                <ClButton shape="round" size="large" bgColor='yellow' plain plainSize='bold'
                  onClick={() => { this.setState({ show: true }); }}>
                  <ClText text="选 择 模 板" size="xlarge" align="center" textColor="orange" />
                </ClButton></ClFlex></View>
            {/* </ClCard> */}
            {/* <ClCard type="full" bgColor='#f7ecdc'> */}
            <View className='at-col at-col-5'>
              <ClFlex justify='center'>
                <ClButton shape="round" size="large" bgColor='yellow' plain plainSize='bold'
                  onClick={this.uploadTemplate.bind(this)}>
                  <ClText text="上 传 模 板" size="xlarge" align="center" textColor="orange" />
                </ClButton></ClFlex></View>
            {/* </ClCard> */}
          </View>
        </View>
        {/* </ClFlex> */}
        <AtDrawer
          show={this.state.show}
          onClose={() => { this.setState({ show: false }); }}
          // width={String(Taro.getStorageSync('width') * 0.6) + 'px'}
          width='267px'
        >
          <Templates />
        </AtDrawer>
      </ClCard>
    )
  }
}

class Start extends Component {
  constructor(props) {
    super(props);
  }


  start() {
    let userImagePath = Taro.getStorageSync('userImagePath')
    let templateType = Taro.getStorageSync('templateType')
    let templateIndex = Taro.getStorageSync('templateIndex')
    let userID = Taro.getStorageSync('userID')
    if (userImagePath == null) {
      Taro.showToast({
        title: '请选择图片！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    console.log('userImagePath', userImagePath)
    console.log('templateType', templateType)
    console.log('temmplateIndex', templateIndex)
    console.log('userID', userID)

    console.log(String(Taro.getStorageSync('width')) + 'px')
    // 上传用户图片
    // Taro.uploadFile({
    //   url: '',
    //   filePath: userImagePath,
    //   name: 'img',
    //   formData: {
    //     tmplateType: templateType,
    //     templateIndex: templateIndex,
    //     userID: userID
    //   },
    //   success: (res) => {

    //   }
    // })
  }

  render() {
    return (
      <ClCard type="full" bgColor='#f7ecdc'>
        {/* <ClButton size="large" bgColor='orange' plain plainSize='bold' long={true} */}
        <ClButton size="large" bgColor='gradualOrange' long={true}
          onClick={this.start.bind(this)}>
          <ClText text="开 始" size="xxlarge" align="center" textColor="white" />
        </ClButton>
      </ClCard>
    )
  }
}

class Help extends Component {
  constructor(props) {
    super(props)
    this.state = { show: false }
  }

  setShow(show) {
    this.setState({ show: show })
  }

  render() {
    return (
      // <ClCard shadow={false} type='full'>
      <View>
        <View className='top-box'>
          <View className='at-row at-row__justify--around at-row__align--center'>
            <ClCard shadow={false} bgColor='white' type='full'>
              <View className='at-row at-row__justify--between at-row__align--center'>
                <View className='at-col at-col-2'>
                  <ClIcon iconName='colorlens' color='red' size='large' /></View>
                <View className='at-col at-col-9'>
                  <ClText text={"开始你的创作！"} size='xxlarge' textColor='orange' /></View>
              </View>
            </ClCard>
            <ClFloatButton
              size='large'
              bgColor='white'
              closeWithShadow={true}
              // direction='vertical'
              icon='question'
              iconColor='red'
              // move={true}
              open={false}
              shadow={false}
              onClick={() => this.setShow(true)}
            />
            {/* <ClAvatar shape='round' size='large' shadow={false}
            headerArray={[{ icon: 'question', bgColor: 'white', iconColor: 'yellow' }]}
            onClick={() => this.setShow(true)}
          /> */}
          </View>
        </View>
        <ClModal
          show={this.state.show}
          closeWithShadow
          title='帮助'
          close
          actions={[{ text: '确认', color: 'blue' }]}
          onCancel={() => this.setShow(false)}
          onClose={() => this.setShow(false)}
          onClick={index => {
            Taro.showToast({
              title: '确认',
              icon: 'none'
            });
          }}
        >
          此处是说明。
        </ClModal>
      </View>
      // {/* </ClCard> */}

    )
  }
}

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
        {/* <View className='top-box'> */}
        <Help />
        {/* </View> */}
        <View className='image-box at-row at-row__justify--center at-row__align--center'>\
            <View className="center">
            <ChooseUserImage />
          </View>
        </View>
        <View className='bottom-box'>
          {/* <ClFlex justify="center"> */}
          <ChooseTemplate />
          {/* </ClFlex> */}
          <Start />
        </View>
      </View>

    )
  }
}

