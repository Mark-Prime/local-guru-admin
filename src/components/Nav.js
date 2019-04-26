import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Navigation } from '@shopify/polaris';

const Section = Navigation.Section;

class Nav extends Component {

  render(){
    return (
      <Navigation location={this.props.location.pathname}>
        <Section
          items={[
            {
              url: '/',
              label: 'Home',
              icon: 'home',
            },
            {
              url: '/orders',
              label: 'Orders',
              icon: 'orders',
            },
            {
              url: '/products',
              label: 'Products',
              icon: 'products',
              subNavigationItems: [
                {
                  url: '/products',
                  label: 'All Products'
                },
                {
                  url: '/products/add',
                  label: 'Add New Product'
                }
              ]
            },
            {
              url: '/analytics',
              label: 'Analytics',
              icon: 'view'
            }
        ]}
        />
        <Section
          title='Settings'
          separator
          items={[
            {
              url: '/account',
              label: 'Account',
              icon: 'profile'
            },
        ]}
      />
    </Navigation>
    )
  }
};

export default withRouter(Nav);
