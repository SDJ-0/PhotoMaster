import React, { Component } from 'react'
import { ScrollView, View } from '@tarojs/components'
import Taro, { getStorageSync, render } from '@tarojs/taro';
import { ClTabs, ClButton, ClFlex, ClCard, ClText, ClIcon, ClModal, ClFloatButton, ClAvatar, ClGrid } from "mp-colorui";
import { AtCard, AtDrawer, AtImagePicker, AtTabs, AtTabsPane } from 'taro-ui';
import './index.scss'




export class Help extends Component {
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
                        this.setState({ show: false })
                    }}
                >
                    <ClText text={"点击“选择模板”可以选择提供的模板！"} size='large' ></ClText>
                    <ClText text={"点击“上传模板”可以上传你喜欢的模板！"} size='large' ></ClText>
                    <ClText text={"点击“开始”进行你的创作！"} size='large' ></ClText>
                    <ClText text={"（上传模板5次/月，开始创作30次/月）"} size='normal' ></ClText>
                </ClModal>
            </View>
            // {/* </ClCard> */}

        )
    }
}