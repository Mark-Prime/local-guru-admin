import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchUserProducts } from '../../actions/ProductActions'
import { Page, Card, ResourceList, TextStyle, Thumbnail, Pagination, FilterType } from '@shopify/polaris'
import Moment from 'react-moment'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

const Date = styled.div`
  color: rgba(0,0,0,0.5);
  padding: .5rem 0 0;
`;

const PaginationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

class AddProduct extends Component {

  state = {
    page: 1,
    isLoaded: false,
    modalOpen: false,
    modalType: '',
    selectedItems: [],
    searchValue: '',
    appliedFilters: []
  }

  componentDidMount(){
    this.props.fetchUserProducts(this.props.user.uid)
    .then(() => {
      this.setState({ isLoaded: true })
    })
  }

  handleSearchChange = (searchValue) => {
    this.setState({searchValue});
  };

  handleFiltersChange = (appliedFilters) => {
    this.setState({appliedFilters});
    if(appliedFilters.length > 0){
      this.props.fetchProducts({ limit: 50 }, appliedFilters)
    } else {
      this.props.fetchProducts({ limit: 50 })
    }
  };

  handleSelectionChange = (selectedItems) => {
    this.setState({selectedItems});
  };

  onPrev = () => {
    const { page } = this.state;
    const limit = 50;
    const firstProduct = Object.keys(this.props.products)[0];
    const offset = this.props.products[firstProduct].created_at;
    console.log(`end before ${firstProduct}`)
    this.props.fetchProducts({ endBefore: offset, limit: limit })
    .then(() => {
      this.setState({ page: page - 1 })
      if(page === 2){
        this.props.history.push(`/products`)
      } else {
        this.props.history.push(`/products/page/${this.state.page}`)
      }
    })
  }

  onNext = () => {
    const { page } = this.state;
    const limit = 50;
    const lastProduct = Object.keys(this.props.products)[49];
    const offset = this.props.products[lastProduct].created_at;
    console.log(`start after ${lastProduct}`)
    this.props.fetchProducts({ startAfter: offset, limit: limit })
    .then(() => {
      this.setState({ page: page + 1 })
      this.props.history.push(`/products/page/${this.state.page}`)
    })
  }

  handleModalToggle = (type) => {
    console.log('toggle modal')
    this.setState({ modalOpen: !this.state.modalOpen, modalType: type })
  }

  renderItem = (item) => {
    const {sku, title, created_at, image} = item;
    const media = <Thumbnail alt={title} source={image} />;

    return (
      <ResourceList.Item
        id={sku}
        url={`/product/${sku}`}
        media={media}
        accessibilityLabel={`View details for ${title}`}
      >
        <h3>
          <TextStyle variation="strong">{title}</TextStyle>
        </h3>
        <Date>Published on <Moment format='MMMM Do, YYYY'>{created_at}</Moment></Date>
      </ResourceList.Item>
    );
  };

  render() {

    const resourceName = {
      singular: 'product',
      plural: 'products',
    };

    const promotedBulkActions = [
      {
        content: 'Edit products',
        onAction: () => this.handleModalToggle(),
      },
    ];

    const bulkActions = [
      {
        content: 'Add tags',
        onAction: () => this.handleModalToggle('addTags'),
      },
      {
        content: 'Remove tags',
        onAction: () => console.log('Todo: implement bulk remove tags'),
      },
      {
        content: 'Delete products',
        onAction: () => this.handleModalToggle('deleteProduct'),
      },
    ];

    const filters = [
      {
        key: 'collectionFilter',
        label: 'Collection',
        operatorText: 'is',
        type: FilterType.Select,
        options: ['Taste', 'Technology', 'Today', 'Tone', 'Tradition', 'Travel', 'Trend', 'Trust']
      },
      {
        key: 'tagFilter',
        label: 'Tagged with',
        type: FilterType.TextField
      },
    ];

    const filterControl = (
      <ResourceList.FilterControl
        filters={filters}
        appliedFilters={this.state.appliedFilters}
        onFiltersChange={this.handleFiltersChange}
        searchValue={this.state.searchValue}
        onSearchChange={this.handleSearchChange}
      />
    );

    return (
      <Page
        title='Products'
        primaryAction={{content: 'Add Product', url: '/products/add'}}
      >
        <Card>
          {this.state.isLoaded
            ?
            <>
              <ResourceList
                resourceName={resourceName}
                items={Object.values(this.props.products)}
                renderItem={this.renderItem}
                selectedItems={this.state.selectedItems}
                onSelectionChange={this.handleSelectionChange}
                promotedBulkActions={promotedBulkActions}
                bulkActions={bulkActions}
                filterControl={filterControl}
              />
              {Object.keys(this.props.products).length > 49
                ?
                  <PaginationFooter>
                    <Pagination
                        hasPrevious={this.state.page > 1}
                        previousKeys={[74]}
                        previousTooltip="j"
                        onPrevious={this.onPrev}
                        hasNext
                        nextKeys={[75]}
                        nextTooltip="k"
                        onNext={this.onNext}
                    />
                  </PaginationFooter>
                :
                  null
              }
            </>
            :
              null
          }
        </Card>
      </Page>
    );
  }

}

export default withRouter(connect((state, ownProps) => ({
  products: state.products,
  user: state.user
}), { fetchUserProducts })(AddProduct));
