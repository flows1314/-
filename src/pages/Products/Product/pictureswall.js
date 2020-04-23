import React from 'react'
import { reqRemoveImgs } from '../../../api'
import { Upload, Icon, Modal, message } from 'antd'
class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [
            // {
            //     uid: '-1',
            //     name: 'image1.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // }
        ]
    }

    // getBase64=(file)=>{
    //     return new Promise((resolve, reject) => {
    //       const reader = new FileReader();
    //       reader.readAsDataURL(file);
    //       reader.onload = () => resolve(reader.result);
    //       reader.onerror = error => reject(error);
    //     });
    //   }

    getImgsName = () => {
        return this.state.fileList.map(item => item.name)
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        //图片上传失败时生成预览url
        // if (!file.url && !file.preview) {
        //   file.preview = await this.getBase64(file.originFileObj);
        // }   

        this.setState({
            //previewImage: file.url || file.preview,
            //使用压缩base64地址，thumbUrl
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = async ({ file, fileList }) => {
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                const { name, url } = result.data
                fileList[fileList.length - 1].name = name
                fileList[fileList.length - 1].url = url
                message.success('图片上传成功')
            } else {
                message.error('图片上传错误')
            }
        } else if (file.status === 'error') {
            message.error('图片上传失败')
        } else if (file.status === 'removed') {
            const result = await reqRemoveImgs(file.name)
            if (result.status === 0) {
                message.success('图片删除成功')
            } else {
                message.success('图片删除失败')
            }
        }
        this.setState({ fileList })
    };

    getImgs = () => {
        const { imgs } = this.props
        console.log(imgs)
        if (imgs && imgs.length > 0) {
            // console.log(imgs)
            const fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                // url: '/upload/image-1587114966990.jpg'
                url: `/upload/${img}`
            }))
        this.setState({fileList})
        }


    }

    componentWillMount() {
        this.getImgs()
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>上传</div>
            </div>
        );
        const { previewVisible, previewImage, fileList } = this.state;
        return (
            <div>
                <Upload
                    accept='image/*'
                    name='image'//发到后台的文件参数名
                    action="/manage/img/upload"//上传地址
                    listType='picture-card'//上传列表的内建样式
                    fileList={fileList}//已经上传的文件列表
                    onPreview={this.handlePreview}//点击文件链接或预览图标时的回调
                    onChange={this.handleChange}//上传中、完成、失败都会调用这个函数
                >
                    {uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}
export default PicturesWall