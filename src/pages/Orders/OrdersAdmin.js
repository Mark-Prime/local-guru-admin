import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchTransactionsAdmin } from '../../actions/TransactionActions'
import { Page, Card, ResourceList, TextStyle, Pagination, Layout, Thumbnail, Badge, Stack } from '@shopify/polaris'
import Moment from 'react-moment'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

const PaginationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

class Orders extends Component {

  state = {
    page: 1,
    isLoaded: false,
    selectedItems: [],
    searchValue: '',
  }

  componentDidUpdate(prevProps){
    if(this.props.transactions !== prevProps.transactions){
      this.setState({ isLoaded: true })
    }
  }

  handleSearchChange = (searchValue) => {
    this.setState({searchValue});
  };

  handleSelectionChange = (selectedItems) => {
    this.setState({selectedItems});
  };

  onPrev = () => {
    const { page } = this.state;
    const limit = 50;
    const firstProduct = Object.keys(this.props.transactions)[0];
    const offset = this.props.transactions[firstProduct].created_at;
    this.props.fetchProducts({ endBefore: offset, limit: limit })
    .then(() => {
      this.setState({ page: page - 1 })
      if(page === 2){
        this.props.history.push(`/transactions`)
      } else {
        this.props.history.push(`/transactions/page/${this.state.page}`)
      }
    })
  }

  onNext = () => {
    const { page } = this.state;
    const limit = 50;
    const lastProduct = Object.keys(this.props.transactions)[49];
    const offset = this.props.transactions[lastProduct].created_at;
    this.props.fetchTransactions({ startAfter: offset, limit: limit })
    .then(() => {
      this.setState({ page: page + 1 })
      this.props.history.push(`/transactions/page/${this.state.page}`)
    })
  }

  handleModalToggle = (type) => {
    this.setState({ modalOpen: !this.state.modalOpen, modalType: type })
  }

  renderItem = (item) => {
    const {id, title, created_at, user, total, items} = item;
    const firstItem = Object.values(items)[0]

    return (
      <ResourceList.Item
        id={id}
        media={<Thumbnail source={firstItem.image} alt={firstItem.title} />}
        url={`/order/view/${id}`}
        accessibilityLabel={`View details for ${title}`}
      >
      <Stack distribution='fillEvenly' spacing='extraLoose'>
        <h3>
          <TextStyle variation="strong">#{id.toUpperCase()}</TextStyle>
        </h3>
        <p>{user.displayName}</p>
        <Badge status='success'>Delivered</Badge>
        <p><TextStyle>${total.toFixed(2)}</TextStyle></p>
        <p><TextStyle variation="subdued"><Moment fromNow unix>{created_at / 1000}</Moment></TextStyle></p>
        </Stack>
      </ResourceList.Item>
    );
  };

  render() {

    const resourceName = {
      singular: 'order',
      plural: 'orders',
    };

    return (
      <Page
        title='Orders'
      >
        <Card sectioned>

          {this.state.isLoaded
            ?
            <>
              <ResourceList
                resourceName={resourceName}
                items={this.props.transactions}
                renderItem={this.renderItem}
                selectedItems={this.state.selectedItems}
                onSelectionChange={this.handleSelectionChange}
              />
              {Object.keys(this.props.transactions).length > 49
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
  transactions: state.transactions,
  user: state.user
}), { fetchTransactionsAdmin })(Orders));
