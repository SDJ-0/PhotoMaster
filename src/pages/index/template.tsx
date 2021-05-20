import React, { Component } from 'react'
import { ScrollView, View } from '@tarojs/components'
import Taro, { getStorageSync, render } from '@tarojs/taro';
import { ClTabs, ClButton, ClFlex, ClCard, ClText, ClIcon, ClTextarea, ClModal, ClInput, ClAvatar, ClGrid } from "mp-colorui";
import { AtCard, AtDrawer, AtImagePicker, AtTabs, AtTabsPane, AtInput, AtTextarea } from 'taro-ui';
import './index.scss'

export class TempalteImg extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            type: props.type
        }
    }

    render() {
        let publicTemplate = [<br />]
        publicTemplate.pop()
        let templateInfo = Taro.getStorageSync(this.state.type + 'TemplateInfo')
        let templateNum = templateInfo.length
        for (let i = 0; i < templateNum; i++) {
            publicTemplate.push(
                <View className='template-card'>
                    <image
                        src={templateInfo[i]['templatePath']}
                        mode='aspectFit'
                        onClick={() => {
                            if (templateInfo[i]['templateState']) {
                                Taro.setStorage({ key: 'templateID', data: templateInfo[i]['templateID'] })
                                Taro.setStorage({ key: 'templatePath', data: templateInfo[i]['templatePath'] })
                                this.props.click(templateInfo[i]['templatePath'], templateInfo[i])
                            }
                            else {
                                Taro.showToast({
                                    title: '模型尚未训练完成，请稍后再试',
                                    icon: 'none'
                                })
                            }
                        }}
                    />
                </View>
            )
        }
        // for (let i = 0; i < 5; i++) {
        //     publicTemplate.push(
        //         <View className='template-card'>
        //             <image
        //                 src={Taro.getStorageSync('userImagePath')}
        //                 mode='aspectFit'
        //                 onClick={() => {
        //                     this.props.click(Taro.getStorageSync('userImagePath'),
        //                         {
        //                             templateName: 'Udnie, Young American Girl',
        //                             authorName: 'Joseph William Turner',
        //                             templateDesc: '我的爸爸英俊潇洒风流倜傥玉树临风后宫三千，全世界第一有钱'
        //                         }
        //                     )
        //                 }}
        //             />
        //         </View>
        //     )
        // }

        const scrollStyle = {
            height: String(Taro.getStorageSync('height') * 0.95) + 'px'
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

    render() {
        const tabList = [{ title: '公用模板' }, { title: '用户模板' }]
        return (
            <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
                <AtTabsPane current={this.state.current} index={0} >
                    <View>
                        <TempalteImg click={this.props.click} type='public' />
                    </View>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={1}>
                    <View>
                        <TempalteImg click={this.props.click} type='private' />
                    </View>
                </AtTabsPane>
            </AtTabs>
        )
    }
}

export class ChooseTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            templateInfo: null,
            templateModalShow: false,
            userTemplateModalShow: false,
            userTemplatePath: '',
            userTemplateTitle: '',
            userTemplateDesc: '',
        };
        Taro.setStorage({ key: 'userImagePath', data: null })
    }


    // 用户上传自定义模板
    uploadTemplate() {
        let that = this
        Taro.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.setState({
                    userTemplateModalShow: true,
                    userTemplatePath: res.tempFilePaths[0]
                })

            },
            fail: () => {
                return Taro.showToast({
                    title: '取消上传',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    }

    showModal(src, info) {
        this.setState({ templateModalShow: true, src: src, templateInfo: info })
    }

    cancelChoose() {
        this.setState({ templateModalShow: false })
        Taro.setStorage({ key: 'templateID', data: null })
        Taro.setStorage({ key: 'templatePath', data: null })
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
                    width='267px'>
                    <Templates click={(src, info) => this.showModal(src, info)} />
                </AtDrawer>
                <ClModal
                    show={this.state.templateModalShow}
                    closeWithShadow
                    title={this.state.templateInfo['templateName']}
                    close
                    actions={[
                        { text: '取消', color: 'red' },
                        { text: '确认', color: 'blue' }
                    ]}
                    onCancel={() => { this.cancelChoose() }}
                    onClose={() => { this.cancelChoose() }}
                    onClick={index => {
                        if (index === 1) {
                            Taro.showToast({
                                title: '选择成功！',
                                icon: 'success',
                                duration: 2000
                            })
                            this.setState({ templateModalShow: false })
                        }
                        else {
                            Taro.showToast({
                                title: '取消',
                                icon: 'none'
                            })
                            this.cancelChoose()
                        }
                    }}
                >
                    <image src={this.state.src} mode='aspectFit' />
                    <ClCard>
                        <ClText text={'作者：' + this.state.templateInfo['authorName']} size='large' />
                        <ClText text={this.state.templateInfo['templateDesc']} />
                    </ClCard>
                </ClModal>
                <ClModal
                    show={this.state.userTemplateModalShow}
                    title='创建你的模板'
                    titleBgColor='white'
                    closeWithShadow={false}
                    actions={[
                        { text: '取消', color: 'red' },
                        { text: '确认', color: 'blue' }
                    ]}
                    onCancel={() => { this.setState({ userTemplateModalShow: false }) }}
                    onClose={() => { this.setState({ userTemplateModalShow: false }) }}
                    onClick={index => {
                        if (index === 1) {
                            if (this.state.userTemplateTitle == '' || this.state.userTemplateDesc == '') {
                                Taro.showToast({
                                    title: '请输入名称及描述',
                                    icon: 'none'
                                })
                                return
                            }
                            Taro.uploadFile({
                                url: 'http://127.0.0.1:8000/train',
                                filePath: this.state.userTemplatePath,
                                name: 'picPath',
                                formData: {
                                    templateName: this.state.userTemplateTitle,
                                    templateDesc: this.state.userTemplateDesc,
                                    userID: Taro.getStorageSync('userID'),
                                    userName: Taro.getStorageSync('userName'),
                                },
                                success: (res) => {
                                    console.log(res);
                                    var accept = Boolean(res.data)
                                    if (!accept) {
                                        Taro.showToast({
                                            title: '上传次数达到上限',
                                            icon: 'none'
                                        })
                                    }
                                    else {
                                        Taro.showToast({
                                            title: '上传成功',
                                            icon: 'success'
                                        })
                                    }
                                },
                                fail: () => {
                                    Taro.showToast({
                                        title: '上传失败',
                                        icon: 'none'
                                    })
                                }
                            })
                            this.setState({
                                userTemplateModalShow: false,
                                userTemplateTitle: '',
                                userTemplateDesc: '',
                                userTemplatePath: '',
                            })
                        }
                        else {
                            Taro.showToast({
                                title: '取消上传',
                                icon: 'none'
                            })
                            this.setState({
                                userTemplateModalShow: false,
                                userTemplateTitle: '',
                                userTemplateDesc: '',
                                userTemplatePath: '',
                            })
                        }
                    }}
                >
                    <image src={this.state.userTemplatePath} mode='aspectFit' />
                    <View className='input-box'>
                        <ClInput placeholder="给你的模板起个名字吧" align='center' clear
                            value={this.state.userTemplateTitle}
                            onChange={(value) => { this.setState({ userTemplateTitle: value }) }}
                        />
                    </View>
                    <View className='input-box'>
                        <AtTextarea placeholder="描述你的模板" maxLength={100} height={200}
                            value={this.state.userTemplateDesc}
                            onChange={(value) => { this.setState({ userTemplateDesc: value }) }}
                        />
                    </View>
                </ClModal>
            </ClCard>
        )
    }
}
