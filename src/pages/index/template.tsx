import React, { Component } from 'react'
import { ScrollView, View } from '@tarojs/components'
import Taro, { getStorageSync, render } from '@tarojs/taro';
import { ClTabs, ClButton, ClFlex, ClCard, ClText, ClIcon, ClModal, ClFloatButton, ClAvatar, ClGrid } from "mp-colorui";
import { AtCard, AtDrawer, AtImagePicker, AtTabs, AtTabsPane } from 'taro-ui';
import './index.scss'

export class TempalteImg extends Component {

    constructor(props) {
        super(props);
        this.state = { show: false }
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
                            this.props.click('public', Taro.getStorageSync('userImagePath'))
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

export class Templates extends Component {
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
                        <TempalteImg click={this.props.click} />
                    </View>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={1}>
                    <View>
                        <TempalteImg click={this.props.click} />
                    </View>
                </AtTabsPane>
            </AtTabs>
        )
    }
}

export class ChooseTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false, modalshow: false, src: '' };
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

    showModal(type, src) {
        this.setState({ modalshow: true, src: src })
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
                    <Templates
                        click={(type, src) => this.showModal(type, src)} />
                </AtDrawer>
                <ClModal
                    show={this.state.modalshow}
                    closeWithShadow
                    title='我是标题'
                    close
                    actions={[
                        {
                            text: '取消',
                            color: 'red'
                        },
                        {
                            text: '确认',
                            color: 'blue'
                        }
                    ]}
                    onCancel={() => { this.setState({ modalshow: false }) }}
                    onClose={() => { this.setState({ modalshow: false }) }}
                    onClick={index => {
                        Taro.showToast({
                            title: index === 0 ? '取消' : '确认',
                            icon: 'none'
                        });
                    }}
                >
                    <image src={this.state.src} mode='aspectFit' />
                </ClModal>
            </ClCard>
        )
    }
}
