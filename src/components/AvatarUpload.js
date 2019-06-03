import React, { Component } from 'react'
import { DropZone, Stack, Thumbnail, Caption } from '@shopify/polaris'

class AvatarUpload extends Component {

  state = {
    files: [],
  }

  render() {
    const {files} = this.state;
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !files.length && <DropZone.FileUpload />;
    const uploadedFiles = files.length > 0 && (
      <Stack vertical>
        {files.map((file, index) => (
          <Stack alignment="center" key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={
                validImageTypes.indexOf(file.type) > 0
                  ? window.URL.createObjectURL(file)
                  : 'https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png?12678548500147524304'
              }
            />
            <div>
              {file.name} <Caption>{file.size} bytes</Caption>
            </div>
          </Stack>
        ))}
      </Stack>
    );

    return (
      <DropZone
        label={this.props.label}
        onDrop={(files, acceptedFiles, rejectedFiles) => {
          this.setState({files: [...this.state.files, ...acceptedFiles]});
        }}
      >
        {uploadedFiles}
        {fileUpload}
      </DropZone>
    );
  }
}

export default AvatarUpload
