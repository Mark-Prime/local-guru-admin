import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page, Layout, Card } from '@shopify/polaris';
import { getPhoto, editPhoto } from '../../actions/PhotoActions';
import { toggleToast } from '../../actions/UIActions';
import { withRouter } from 'react-router-dom';
import EditPhoto from '../../components/EditPhoto';
import EditTags from '../../components/EditTags';
import styled from 'styled-components';

const Image = styled.div`
  img {
    width: 100%;
  }
`;

class Edit extends Component {

  state = {
    isLoaded: false,
    photo: {},
    values: {},
    touched: false,
  }

  componentDidMount(){
    const sku = this.props.match.params.sku;
    getPhoto(sku).then(photo => {
      this.setState({ photo: photo, values: photo, isLoaded: true })
    })
  }

  handleChangeTextField = (value, id) => {
    this.setState({ touched: true })
    this.setState({ values: { ...this.state.values, [id]: value }})
  }

  handleSelectChange = (value, id) => {
    this.setState({ touched: true })
    this.setState({ values: { ...this.state.values, [id]: value} })
  }

  handleSubmit = () => {
    const { photo, values } = this.state;
    editPhoto(photo.sku, values)
    .then(() => {
      getPhoto(photo.sku).then(photo => {
        this.setState({ photo: photo, values: photo, isLoaded: true, touched: false })
      })
    })
    .then(() => {
      this.props.toggleToast('Product updated')
    })
    .catch(err => {
      console.log(err)
    })
  }

  addTag = tag => {
    let { tags } = this.state.values;
    if (typeof tags !== 'undefined') {
      tags.push(tag);
    } else {
      tags = [tag];
    }
    this.setState({ touched: true, values: { ...this.state.values, tags: tags } })
  }

  removeTag = tag => {
    let filteredArray = this.state.values.tags.filter(item => item !== tag)
    this.setState({ touched: true, values: { ...this.state.values, tags:  filteredArray }});
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {

    const { isLoaded, photo, touched, values } = this.state;

    return (
      <>
        {isLoaded
          ?
            <Page
              breadcrumbs={[{content: 'Photos', onAction: this.goBack}]}
              title={photo.title}
              primaryAction={{ content: 'Save', disabled: !touched, onAction: this.handleSubmit }}
              secondaryActions={[{
                  icon: 'view',
                  content: 'View Photo',
                  url: `https://tonl-beta.firebaseapp.com/photo/${photo.sku}`
              }]}
            >
              <Layout>
                <Layout.Section>
                  <EditPhoto
                    title={values.title}
                    description={values.description}
                    color={values.color}
                    race={values.race}
                    collection={values.collection}
                    handleChangeTextField={this.handleChangeTextField}
                    handleSelectChange={this.handleSelectChange}
                  />
                </Layout.Section>
                <Layout.Section secondary>
                  <Card sectioned>
                    <Image>
                      <img src={`https://s3-us-west-2.amazonaws.com/tonl-photosresized/images/medium/${photo.sku}.jpg`} alt={photo.title} />
                    </Image>
                  </Card>
                  <EditTags
                    addTag={this.addTag}
                    removeTag={this.removeTag}
                    tags={values.tags}
                  />
                </Layout.Section>
              </Layout>
            </Page>
          :
            null
        }
      </>
    );
  }

}

export default withRouter(connect((state, ownProps) => ({}), { toggleToast })(Edit));
