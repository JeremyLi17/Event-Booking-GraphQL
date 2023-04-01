import React, { useContext, useRef, useState } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';

const AuthPage = () => {
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const [isLogin, setIsLogin] = useState(true);
  const userContext = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    // send to backend
    let requestBody = {
      // approach 1, inject the variable directly into the query
      // query: `
      //   query {
      //     login(
      //       email: "${email}",
      //       password: "${password}"
      //     ) {
      //       userId
      //       token
      //       tokenExpiration
      //     }
      //   }
      // `,

      query: `
        query Login($email: String!, $password: String!) {
          login(
            email: $email,
            password: $password
          ) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password,
      },
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {
              email: $email,
              password: $password
            }) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password,
        },
      };
    }

    try {
      // or set "proxy": "http://localhost:8800/graphql" in package.json
      const res = await fetch('http://localhost:8800/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          // data format is json
          'Content-Type': 'application/json',
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }

      const userData = await res.json();

      if (isLogin && userData.data.login.token) {
        userContext.login(
          userData.data.login.token,
          userData.data.login.userId,
          userData.data.login.tokenExpiration
        );
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={emailRef} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordRef} />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          Switch to {isLogin ? 'SignUp' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
