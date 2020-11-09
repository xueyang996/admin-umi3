/* eslint-disable func-names */
import React from 'react';
import { Editor } from './TinymceReact';
// import { uploadImage } from '@/services/global';

interface RichText {
  /** tinymceSrc tinymce js文件地址 */
  tinymceSrc?: string;
  /** value richtext 值 */
  value?: string;
  /** fileKey formData key值 */
  fileKey?: string;
  /** height 高度  */
  height?: number;
  onChange?: (params: any) => void;
  /** 上传成功回调函数 */
  callBack?: (params: any) => void;
  /** uploadImage 上传图片方法 */
  uploadImage?: (params: any) => Promise<any>;
}

const callBackDefault = (res: any) => {
  const { data } = res;
  return data.file_url;
};
const RichText = (props: RichText) => {
  const {
    value,
    onChange,
    height = 500,
    uploadImage,
    fileKey = 'file',
    tinymceSrc = 'https://admin-ipark.ai-indeed.com/lib/tinymce.min.js',
    callBack = callBackDefault,
  } = props;

  const handleEditorChange = (content: string) => {
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <Editor
      // apiKey="hxwv2utnjoz9wzhh430d6lo6pbu1exm8k5sks1coqs79jf9z"
      // tinymceScriptSrc="http://ipark-admin-fe.qa.ii-ai.tech/lib/tinymce.min.js"
      tinymceScriptSrc={tinymceSrc}
      value={value}
      init={{
        height,
        language: 'zh_CN',
        menubar: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          // eslint-disable-next-line no-multi-str
          'undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify \
             bullist numlist outdent indent | removeformat | help',
        images_upload_handler(
          blobInfo: { blob: () => any },
          sucCallback: (arg0: any) => void,
          failCallback: (arg0: string) => void,
        ) {
          const file = blobInfo.blob();
          const formData = new FormData();
          formData.append(fileKey, file, file.name);
          if (uploadImage) {
            uploadImage(formData)
              .then((res) => {
                const callBackParams = callBack(res);
                sucCallback(callBackParams);
              })
              .catch(() => {
                failCallback('图片上传失败');
              });
          }
        },
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default RichText;
