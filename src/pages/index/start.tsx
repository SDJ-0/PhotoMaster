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
            outShow: false
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
        console.log('userImagePath', userImagePath)
        console.log('templateID', templateID)
        console.log('userID', userID)
        // // 上传用户图片
        // Taro.uploadFile({
        //     url: 'http://127.0.0.1:8000/transfer',
        //     filePath: userImagePath,
        //     name: 'img',
        //     formData: {
        //         tmplateID: Taro.getStorageSync('templateID'),
        //         userID: Taro.getStorageSync('userID'),
        //     },
        //     success: (res) => {
        //         if (res.data.url == ''){
        //             Taro.showToast({
        //                 title: '使用次数到达上限',
        //                 icon: 'none'
        //             })
        //         }
        //         Taro.downloadFile({
        //             url: res.data.url,
        //             success: function (res) {
        //                 if (res.statusCode === 200) {
        //                     that.setState({
        //                         outPath: res.tempFilePath,
        //                         outshow: true
        //                     })
        //                 }
        //             },
        //             fail: () => {
        //                 Taro.showToast({
        //                     title: '失败',
        //                     icon: 'none'
        //                 })
        //             }
        //         })
        //     }
        // })
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
                </ClModal>
            </ClCard>
        )
    }
}