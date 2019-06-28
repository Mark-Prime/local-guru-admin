import React, { Component } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { uiConfig, auth} from '../firebase'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Wrapper = styled.div`
  margin: calc(119px + 4rem) auto 4rem;
  width: 90vw;

  p {
    text-align: center;

    a {
      text-decoration: none;
    }
  }
`;

class Login extends Component {

  render() {
    return (
      <Wrapper>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
        <p>Don't have an account? <Link to='/create-account'>Register</Link></p>
      </Wrapper>
    );
  }

}

export default Login;
