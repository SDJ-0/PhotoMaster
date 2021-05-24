import { Component } from 'react'
import { ScrollView, View } from '@tarojs/components'
import Taro from '@tarojs/taro';
import { ClButton, ClFlex, ClCard, ClText, ClModal, ClInput } from "mp-colorui";
import { AtDrawer, AtTabs, AtTabsPane, AtTextarea } from 'taro-ui';
import './index.scss'

export class TempalteImg extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            trigger: false,
            type: props.type,
        }
    }

    // 获取用户模板信息
    getPrivateTemplate() {
        let that = this
        that.setState({ trigger: true })
        Taro.request({
            url: 'https://photomaster.ziqiang.net.cn/usertemplate/',
            data: { userID: Taro.getStorageSync('userID') },
            // data: { userID: 'test' },
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
                                        reject('fail to download private picture');
                                    }
                                },
                                fail: () => { reject('fail to get private url') }
                            })
                        }))
                    });
                    Promise.all(ps).then(values => { Taro.setStorage({ key: 'privateTemplateInfo', data: memory }) })
                        .catch(reason => { console.log(reason) })
                        .finally(() => that.setState({ trigger: false }))
                }
            },
            fail: () => {
                Taro.showToast({ title: '获取用户模板信息失败', icon: 'none' })
                that.setState({ trigger: false })
            },
        })
    }

    // 获取公共模板信息
    getPublicTemplate() {
        let that = this
        that.setState({ trigger: true })
        Taro.request({
            url: 'https://photomaster.ziqiang.net.cn/template/',
            dataType: 'json',
            method: "GET",
            success: function (res) {
                // console.log(res);
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
                    // console.log(info);
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
                        .finally(() => that.setState({ trigger: false }))
                }
            },
            fail: () => {
                Taro.showToast({ title: '获取公共模板信息失败', icon: 'none' })
                that.setState({ trigger: false })
            }
        })
    }

    refresh() {
        if (this.state.type === 'public') {
            this.getPublicTemplate()
        }
        else {
            this.getPrivateTemplate()
        }
    }

    render() {
        let templateList = [<br />]
        templateList.pop()
        let templateInfo = Taro.getStorageSync(this.state.type + 'TemplateInfo')
        let templateNum = templateInfo.length
        for (let i = 0; i < templateNum; i++) {
            templateList.push(
                <View className='template-card'>
                    <View className='template-imgwrap'>
                        <image
                            src={templateInfo[i]['templatePath']}
                            mode='aspectFit'
                            className="template-imgbox"
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
                </View>
            )
        }

        const scrollStyle = {
            height: String(Taro.getSystemInfoSync().windowHeight * 0.95) + 'px'
        }

        return (
            <ScrollView
                className='scroll-box'
                scrollY
                scrollWithAnimation
                style={scrollStyle}
                refresherEnabled
                refresherTriggered={this.state.trigger}
                onRefresherRefresh={this.refresh.bind(this)}
            >
                <ClFlex wrap={true} justify="between">
                    {templateList}
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
            templateInfo: {
                templateName: '',
                authorName: '',
                templateDesc: ''
            },
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

    chooseTemplate(index) {
        if (index === 1) {
            Taro.showToast({
                title: '选择成功！',
                icon: 'success',
                duration: 2000
            })
            this.setState({ templateModalShow: false })
            this.setState({ show: false })
        }
        else {
            this.cancelChoose()
        }
    }

    editUserTemplateInfo(index) {
        if (!Taro.getStorageSync('login')) {
            Taro.showToast({ title: "未登录" })
        }
        else {
            if (index === 1) {
                if (this.state.userTemplateTitle == '' || this.state.userTemplateDesc == '') {
                    Taro.showToast({
                        title: '请输入名称及描述',
                        icon: 'none'
                    })
                    return
                }
                Taro.uploadFile({
                    url: 'https://photomaster.ziqiang.net.cn/train/',
                    filePath: this.state.userTemplatePath,
                    name: 'picPath',
                    formData: {
                        templateName: this.state.userTemplateTitle,
                        templateDesc: this.state.userTemplateDesc,
                        userID: Taro.getStorageSync('userID'),
                        // userID: 'test',
                        userName: Taro.getStorageSync('userName'),
                    },
                    success: (res) => {
                        if (res.data === 'SysBusy') {
                            Taro.showToast({
                                title: "系统繁忙，请稍后再试！",
                                icon: "none"
                            })
                        }
                        else {
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
        }
    }

    render() {
        return (
            <ClCard type="full" shadow={false} bgColor='#f7ecdc'>
                <View className="chooseButton-box">
                    <View className='at-row at-row__justify--around at-row__align--center' >
                        <View className='at-col at-col-5'>
                            <ClFlex justify='center'>
                                <ClButton shape="round" size="large" bgColor='yellow' plain plainSize='bold'
                                    onClick={() => { this.setState({ show: true }); }}>
                                    <ClText text="选 择 模 板" size="xlarge" align="center" textColor="orange" />
                                </ClButton>
                            </ClFlex>
                        </View>
                        <View className='at-col at-col-5'>
                            <ClFlex justify='center'>
                                <ClButton shape="round" size="large" bgColor='yellow' plain plainSize='bold'
                                    onClick={this.uploadTemplate.bind(this)}>
                                    <ClText text="上 传 模 板" size="xlarge" align="center" textColor="orange" />
                                </ClButton>
                            </ClFlex>
                        </View>
                    </View>
                </View>
                <AtDrawer
                    show={this.state.show}
                    onClose={() => { this.setState({ show: false }); }}
                    width='280px'>
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
                    onClick={index => { this.chooseTemplate(index) }}
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
                    onClick={index => { this.editUserTemplateInfo(index) }}
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
