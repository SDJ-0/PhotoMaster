import React, { Component } from 'react'
import { ScrollView, View } from '@tarojs/components'
import Taro, { getStorageSync, render } from '@tarojs/taro';
import { ClTabs, ClButton, ClFlex, ClCard, ClText, ClIcon, ClModal, ClFloatButton, ClAvatar, ClGrid } from "mp-colorui";
import { AtCard, AtDrawer, AtImagePicker, AtTabs, AtTabsPane } from 'taro-ui';
import './index.scss'

export class Start extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outPath: '',
            outShow: false,
            processing: false
        }
    }


    start() {
        let that = this
        let userImagePath = Taro.getStorageSync('userImagePath')
        let templateID = Taro.getStorageSync('templateID')
        let userID = Taro.getStorageSync('userID')
        if (userImagePath === null || templateID === null) {
            Taro.showToast({
                title: '请选择图片及模板！',
                icon: 'none',
                duration: 2000
            })
            return
        }
        console.log('userID', userID)
        // 上传用户图片
        if (this.state.processing) {
            Taro.showToast({
                title: '请耐心等待结果^_^',
                icon: 'none'
            })
            return
        }
        this.setState({ processing: true })
        Taro.uploadFile({
            url: 'http://127.0.0.1:8000/transfer/',
            filePath: userImagePath,
            name: 'img',
            formData: {
                templateID: Taro.getStorageSync('templateID'),
                // userID: Taro.getStorageSync('userID'),
                userID: 'test',
            },
            success: (res) => {
                console.log(res)
                if (res.data == '') {
                    Taro.showToast({
                        title: '使用次数到达上限',
                        icon: 'none'
                    })
                    this.setState({ processing: false })
                    return
                }
                Taro.downloadFile({
                    url: res.data,
                    success: function (res) {
                        if (res.statusCode === 200) {
                            that.setState({
                                outPath: res.tempFilePath,
                                outShow: true
                            })
                        }
                        console.log('download success')
                        Taro.setStorage({ key: "templateID", data: null })
                        this.setState({ processing: false })
                    },
                    fail: () => {
                        Taro.showToast({
                            title: '下载失败',
                            icon: 'none'
                        })
                        Taro.setStorage({ key: "templateID", data: null })
                        this.setState({ processing: false })
                    }
                })
            }
        })
    }


    clean() {
        this.setState({
            outShow: false,
            outPath: ''
        })
    }

    render() {
        let that = this
        return (
            <ClCard type="full" bgColor='#f7ecdc'>
                {/* <ClButton size="large" bgColor='orange' plain plainSize='bold' long={true} */}
                <ClButton size="large" bgColor='gradualOrange' long={true}
                    onClick={this.start.bind(this)}>
                    <ClText text="开 始" size="xxlarge" align="center" textColor="white" />
                </ClButton>
                <ClModal
                    show={that.state.outShow}
                    // show={true}
                    title='你的作品'
                    actions={[
                        { text: '关闭', color: 'red' },
                        { text: '保存', color: 'blue' }
                    ]}
                    onCancel={() => { this.clean() }}
                    onClose={() => { this.clean() }}
                    onClick={index => {
                        if (index === 1) {
                            Taro.saveImageToPhotosAlbum({
                                filePath: this.state.outPath,
                                success: function (res) {
                                    Taro.showToast({
                                        title: '保存成功',
                                        icon: 'success'
                                    })
                                },
                                fail: () => Taro.showToast({
                                    title: '保存失败',
                                    icon: 'none'
                                })
                            })
                        }
                        else {
                            Taro.showToast({
                                title: '取消',
                                icon: 'none'
                            })
                        }
                        this.clean()
                    }}
                >
                    <view className="outcome-box">
                        <view className="local-box">
                            <view className="localtot-box">
                                <ClText text="原 图"></ClText>
                                <image src={Taro.getStorageSync('userImagePath')} mode='aspectFit' style="padding:8%;"></image>
                            </view>
                            <view className="localtot-box">
                                <ClText text="模 板"></ClText>
                                <image src={Taro.getStorageSync('templatePath')} mode='aspectFit' style="padding:8%;"></image>
                            </view></view>
                        <view className="return-box">
                            <ClText text="结 果" size="large"></ClText>
                            <image src={this.state.outPath} mode='aspectFit' style="padding:8%;"></image>
                        </view>
                    </view>
                </ClModal>
            </ClCard>
        )
    }
}