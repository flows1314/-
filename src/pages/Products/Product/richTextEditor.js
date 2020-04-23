import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

class EditorConvertToHTML extends Component {
    state = {
        editorState: EditorState.createEmpty()//创建没有内容的编辑对象
    }

    constructor(props) {
        super(props);
        const html = this.props.detail;
        if (html) {//如果有值，根据html格式创建一个编辑对象
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            }else{
                this.state={
                    editorState: EditorState.createEmpty()//创建没有内容的编辑对象
                }
            }
        }

    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    //将draft文本转换从html
    getDraftToHtml = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    //富文本图片上传
    uploadImageCallBack=(file)=> {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/manage/img/upload');//图片上传地址
            xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
            const data = new FormData();
            data.append('image', file);//指定上传图片的参数，image
            xhr.send(data);
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            });
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              reject(error);
            });
          }
        );
      }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    editorStyle={{ border: '1px solid black', minHeight: 200, margin: 0, paddingLeft: 5 }}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                      }}
                />
                {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
            </div>
        );
    }
}
export default EditorConvertToHTML;