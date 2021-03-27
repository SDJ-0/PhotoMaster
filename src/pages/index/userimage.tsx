import React, { Component } from 'react'
import Taro, { getStorageSync, render } from '@tarojs/taro';
import { ClTabs, ClButton, ClFlex, ClCard, ClText, ClIcon, ClModal, ClFloatButton, ClAvatar, ClGrid } from "mp-colorui";
import { AtCard, AtDrawer, AtImagePicker, AtTabs, AtTabsPane } from 'taro-ui';
import './index.scss'



export class ChooseUserImage extends Component {
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
