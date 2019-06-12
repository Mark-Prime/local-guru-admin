import React, { Component } from 'react'
import styled from 'styled-components';
import { DropZone, Stack, Thumbnail, Caption } from '@shopify/polaris'

const Wrapper = styled.div`
  width: 200px;
`;

class AvatarUpload extends Component {

  state = {
    files: [],
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.files !== prevState.files){
      this.props.onChange(this.state.files[0])
    }
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
      <Wrapper>
        <DropZone
          label='Profile photo'
          allowMultiple={false}
          onDrop={(files, acceptedFiles, rejectedFiles) => {
            this.setState({files: [...this.state.files, ...acceptedFiles]});
          }}
        >
          {uploadedFiles}
          {fileUpload}
        </DropZone>
      </Wrapper>
    );
  }
}

export default AvatarUpload
