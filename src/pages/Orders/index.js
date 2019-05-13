import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchTransactions } from '../../actions/TransactionActions'
import { Page, Card, ResourceList, TextStyle, Thumbnail, Pagination, FilterType, Layout, Avatar } from '@shopify/polaris'
import Moment from 'react-moment'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import OrderPreview from '../../components/OrderPreview'
import OrderOverview from '../../components/OrderOverview'

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
    modalOpen: false,
    modalType: '',
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

  orderTotal = (item) => {
    let total = 0;

    Object.keys(item.items).map(i => {
      const { price, count, producer } = item.items[i]

      if(producer === this.props.user.uid){
        total = total + price * count
      }
    })

    return total
  }

  listItems = (item) => {
    let list = [];

    Object.keys(item.items).map((i, index) => {
      const { price, count, producer, title } = item.items[i]

      if(producer === this.props.user.uid){
        list[index] = `${title} x${count}`;
      }
    })

    return list.join(', ')
  }

  transformTransactions = (transactions) => {

    let orders = {}

    // Map through transactions array
    transactions.map(transaction => {
      // Get User UID from transaction
       const { uid } = transaction.user;

      // Check if we've seen this user
       if(orders[uid]){
         // If we've already seen this user, combine their order

         let updatedItems = orders[uid].items;

         Object.keys(transaction.items).map(item => {
           // Check if this item has been seen
           if(updatedItems[item]){
             // If it does exist, add the counts
             updatedItems[item] = {
               ...transaction.items[item],
               count: transaction.items[item].count + updatedItems[item].count
             }
           } else {
             updatedItems[item] = transaction.items[item]
           }
         })

         orders[uid] = { ...orders[uid], items: updatedItems }
       } else {
         // Otherwise add this user
         orders = { [uid]: transaction , ...orders}
       }
    })

    return Object.values(orders)
  }

  renderItem = (item) => {
    const {id, title, created_at, image, count, user} = item;
    const media = <Thumbnail alt={title} source={image} />;

    return (
      <ResourceList.Item
        id={id}
        media={<Avatar source={user.photoURL} name={user.displayName} />}
        url={`/order/view/${id}`}
        accessibilityLabel={`View details for ${title}`}
      >
        <h3>
          <TextStyle variation="strong">{user.displayName}</TextStyle>
        </h3>
        <p><TextStyle variation="subdued"><Moment format='MMMM Do, YYYY' unix>{created_at / 1000}</Moment></TextStyle></p>
        <br/>
        <p><strong>Total:</strong> ${this.orderTotal(item).toFixed(2)}</p>
        <p><strong>Items:</strong> <TextStyle variation="subdued">{this.listItems(item)}</TextStyle></p>
      </ResourceList.Item>
    );
  };

  render() {

    const resourceName = {
      singular: 'order',
      plural: 'orders',
    };

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

    return (
      <Page
        title='Orders'
      >
        <Layout>
          <OrderPreview />
        </Layout>
        <br/><br/>
        <OrderOverview orders={this.props.transactions} user={this.props.user.uid} />
        <br/><br/>
        <Card>
          {this.state.isLoaded
            ?
            <>
              <ResourceList
                resourceName={resourceName}
                items={this.transformTransactions(this.props.transactions)}
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
}), { fetchTransactions })(Orders));
