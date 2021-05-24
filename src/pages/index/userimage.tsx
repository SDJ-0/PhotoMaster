import { Component } from 'react'
import Taro from '@tarojs/taro';
import { ClCard } from "mp-colorui";
import { AtImagePicker } from 'taro-ui';
import './index.scss'

export class ChooseUserImage extends Component {
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
    render() {
        return (
            <ClCard shadow={true} bgColor='white' >
                <AtImagePicker
                    length={1}
                    count={1}
                    showAddBtn={this.state.showAdd}
                    mode='aspectFit'
                    files={this.state.files}
                    onChange={this.onChange.bind(this)}
                />
            </ClCard>
        )
    }
}
