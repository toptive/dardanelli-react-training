import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import Cookies from 'js-cookie';

/* utils */
import { absoluteUrl } from '../../middleware/utils';
//jwt decode
import jwtDecode from 'jwt-decode';
/* components */
import Layout from '../../components/layout/Layout';
import FormLogin from '../../components/form/FormLogin';


const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,2|3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* login schemas */
const FORM_DATA_LOGIN = {
  email: {
    value: '',
    label: 'Email',
    min: 10,
    max: 36,
    required: true,
    validator: {
      regEx: emailRegEx,
      error: 'Please insert valid email',
    },
  },
  password: {
    value: '',
    label: 'Password',
    min: 6,
    max: 36,
    required: true,
    validator: {
      regEx: /^[a-z\sA-Z0-9\W\w]+$/,
      error: 'Please insert valid password',
    },
  },
};

const GOOGLE_LOGIN = {
  googleId: {
    value: '',
    label: 'Google ID',
    required: true,
  },
  email: {
    value: '',
    label: 'Email',
    min: 10,
    max: 36,
    required: true,
  },
  firstName: {
    value: '',
    label: 'Username',
    min: 10,
    max: 36,
    required: true,
  },
  lastName: {
    value: '',
    label: 'Lastname',
    min: 10,
    max: 36,
    required: true,
  },
};

function Login(props) {
  const router = useRouter();
  

  const { origin, referer, baseApiUrl } = props;
  const [loading, setLoading] = useState(false);

  const [stateGoogleForm, setStateGoogleForm] = useState(GOOGLE_LOGIN);
  const [stateFormData, setStateFormData] = useState(FORM_DATA_LOGIN);
  const [stateFormError, setStateFormError] = useState([]);
  const [stateFormValid, setStateFormValid] = useState(false);
  const [stateFormMessage, setStateFormMessage] = useState({});
  //google login
  
  const [user, setUser] = useState({});
  const handleCallbackResponse = async response => {
    console.log('Encoded JWT ID token: ' + response.credential);
    var userObject = jwtDecode(response.credential);    
    setUser(userObject);
    const googleId = userObject.sub;
    const email = userObject.email;
    const firstName = userObject.given_name;
    const lastName = userObject.family_name;
    let data = { ...stateGoogleForm };
    data = { ...data, googleId: googleId };
    data = { ...data, email: email };
    data = { ...data, firstName: firstName };
    data = { ...data, lastName: lastName };
    
    
    const loginGoogleApi = await fetch(`${baseApiUrl}/authGoogle`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify(data),
      
    }).catch(error => {          
      console.error('Error:', error);
      
    });
    let result = await loginGoogleApi.json();    
    if (result.success && result.token) {
      Cookies.set('token', result.token);
      Router.push('/');
    } else {
      setStateFormMessage(result);
    }
    document.getElementById('signInDiv').hidden = true;
    
  };
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        '1004393045215-nnd7mi7h3findtjqj43ijvdrfaga9p37.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
    });
  }, []);
  

 

  function onChangeHandler(e) {
    const { name, value } = e.currentTarget;

    setStateFormData({
      ...stateFormData,
      [name]: {
        ...stateFormData[name],
        value,
      },
    });

    /* validation handler */
    validationHandler(stateFormData, e);
  }

  async function loginSubmitHandler(e) {
    onSubmitHandler(
      e,
      stateFormData,
      baseApiUrl,
      setLoading,
      loading,
      validationHandler,
      Cookies,
      setStateFormMessage,
    );
  }

  function validationHandler(states, e) {
    const input = (e && e.target.name) || '';
    const errors = [];
    let isValid = true;

    if (input) {
      if (states[input].required) {
        if (!states[input].value) {
          errors[input] = {
            hint: `${states[e.target.name].label} required`,
            isInvalid: true,
          };
          isValid = false;
        }
      }
      if (
        states[input].value &&
        states[input].min > states[input].value.length
      ) {
        errors[input] = {
          hint: `Field ${states[input].label} min ${states[input].min}`,
          isInvalid: true,
        };
        isValid = false;
      }
      if (
        states[input].value &&
        states[input].max < states[input].value.length
      ) {
        errors[input] = {
          hint: `Field ${states[input].label} max ${states[input].max}`,
          isInvalid: true,
        };
        isValid = false;
      }
      if (
        states[input].validator !== null &&
        typeof states[input].validator === 'object'
      ) {
        if (
          states[input].value &&
          !states[input].validator.regEx.test(states[input].value)
        ) {
          errors[input] = {
            hint: states[input].validator.error,
            isInvalid: true,
          };
          isValid = false;
        }
      }
    } else {
      Object.entries(states).forEach(item => {
        item.forEach(field => {
          errors[item[0]] = '';
          if (field.required) {
            if (!field.value) {
              errors[item[0]] = {
                hint: `${field.label} required`,
                isInvalid: true,
              };
              isValid = false;
            }
          }
          if (field.value && field.min >= field.value.length) {
            errors[item[0]] = {
              hint: `Field ${field.label} min ${field.min}`,
              isInvalid: true,
            };
            isValid = false;
          }
          if (field.value && field.max <= field.value.length) {
            errors[item[0]] = {
              hint: `Field ${field.label} max ${field.max}`,
              isInvalid: true,
            };
            isValid = false;
          }
          if (field.validator !== null && typeof field.validator === 'object') {
            if (field.value && !field.validator.regEx.test(field.value)) {
              errors[item[0]] = {
                hint: field.validator.error,
                isInvalid: true,
              };
              isValid = false;
            }
          }
        });
      });
    }
    if (isValid) {
      setStateFormValid(isValid);
    }
    setStateFormError({
      ...errors,
    });
    return isValid;
  }

  return (
    <Layout
      title="Next.js with Sequelize | Login page"
      url={`${origin}${router.asPath}`}
      origin={origin}
    >
      <div className="container">
        <main className="content-detail">
          <h2 style={{ textAlign: 'center' }}>Log in with your account.</h2>
          <br/>
          <Link
            href={{
              pathname: '/user',
            }}
          >
            <a>&larr; Back</a>
          </Link>
          <FormLogin
            props={{
              loginSubmitHandler,
              onChangeHandler,
              loading,
              stateFormData,
              stateFormError,
              stateFormMessage,
            }}
          />
          <h3 style={{ textAlign: 'center' }}>Or use your google account.</h3>
          <br/>
          <div id="signInDiv" style={{ marginLeft: '90px' }}>
            
          </div>
        </main>
      </div>
    </Layout>
  );
}

/* getServerSideProps */
export async function getServerSideProps(context) {
  const { req } = context;
  const { origin } = absoluteUrl(req);

  const referer = req.headers.referer || '';
  const baseApiUrl = `${origin}/api`;

  return {
    props: {
      origin,
      referer,
      baseApiUrl,
    },
  };
}

export default Login;
