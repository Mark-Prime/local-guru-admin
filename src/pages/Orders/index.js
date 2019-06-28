import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchTransactions } from '../../actions/TransactionActions'
import { Page, Card, ResourceList, TextStyle, Pagination, Layout, Avatar } from '@shopify/polaris'
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
        return total = total + price * count
      } else {
        return false
      }
    })

    return total
  }

  listItems = (item) => {
    let list = [];

    Object.keys(item.items).map((i, index) => {
      const { count, producer, title } = item.items[i]

      if(producer === this.props.user.uid){
        return list[index] = `${title} x${count}`;
      } else {
        return false
      }
    })

    return list.join(', ')
  }

  transformTransactions = (transactions) => {

    // create empty object
    let orders = {}

    // Map through transactions array
    transactions.forEach(transaction => {

      // Get User ID
      const { uid } = transaction.user;
      let currentUserOrder = orders[uid];

      // check if user is in orders object
      if(currentUserOrder){

        // map through the items in the transaction
        Object.keys(transaction.items).map(item => {

          let currentItem = currentUserOrder.items[item];

          // if the items already exists, add to it
          if(currentItem){
            const newCount = currentItem.count + transaction.items[item].count
            return currentUserOrder.items = {
              ...currentUserOrder.items,
              [item]: { count: newCount  }
            }
          } else {
            return orders[uid].items[item] = transaction.items[item]
          }
        })

      // If they don't add the first transaction
      } else {
        orders = { [uid]: transaction }
      }
    })

    console.log(orders)
    return Object.values(orders)
  }

  renderItem = (item) => {
    const {id, title, created_at, user} = item;

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