import React, { Component } from 'react'
import { ScrollView, View } from '@tarojs/components'
import Taro, { getStorageSync, render } from '@tarojs/taro';
import { ClTabs, ClButton, ClFlex, ClCard, ClText, ClIcon, ClModal, ClFloatButton, ClAvatar, ClGrid } from "mp-colorui";
import { AtCard, AtDrawer, AtImagePicker, AtTabs, AtTabsPane } from 'taro-ui';
import './index.scss'

export class Start extends Component {
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