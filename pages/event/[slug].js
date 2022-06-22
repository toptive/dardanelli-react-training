import React, { useState, useEffect } from 'react';
import {Toaster,toast} from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/router';

/* utils */
import { absoluteUrl, getAppCookies } from '../../middleware/utils';

/* components */
import Layout from '../../components/layout/Layout';
import FormEvent from '../../components/form/FormEvent';

/* post schemas */

const FORM_DATE_EVENT = {
  title: {
    value: '',
    label: 'Title',
    min: 10,
    max: 36,
    required: true,
    validator: {
      regEx: /^[a-z\sA-Z0-9\W\w]+$/,
      error: 'Please insert valid Title',
    },
  },
  content: {
    value: '',
    label: 'Content',
    min: 6,
    max: 1500,
    required: true,
    validator: {
      regEx: /^[a-z\sA-Z0-9\W\w]+$/,
      error: 'Please insert valid Content',
    },
  },
  dateStart: {
    value: '',
    label: 'Date',
    min: 6,
    max: 24,
    required: true,
    validator: {
      regEx: /^[a-z\sA-Z0-9\W\w]+$/,
      error: 'Please insert valid Date start',
    },
  },
  dateEnd: {
    value: '',
    label: 'Date',
    min: 6,
    max: 24,
    required: true,
    validator: {
      regEx: /^[a-z\sA-Z0-9\W\w]+$/,
      error: 'Please insert valid Date end',
    },
  },
};

function Event(props) {
  const router = useRouter();

  const { origin, event, token, user } = props;

  const { baseApiUrl } = props;
  const [loading, setLoading] = useState(false);

  const [stateFormData, setStateFormData] = useState(FORM_DATE_EVENT);
  const [stateFormError, setStateFormError] = useState([]);
  const [stateFormMessage, setStateFormMessage] = useState({});
  const [stateFormValid, setStateFormValid] = useState(false);

  async function onSubmitHandler(e) {
    e.preventDefault();

    let data = { ...stateFormData };

    /* title */
    data = { ...data, title: data.title.value || '' };
    /* content */
    data = { ...data, content: data.content.value || '' };
    /* dateStart */
    data = { ...data, dateStart: data.dateStart.value || '' };
    /* dateEnd */
    data = { ...data, dateEnd: data.dateEnd.value || '' };

    /* validation handler */
    const isValid = validationHandler(stateFormData);

    if (isValid) {
      // Call an external API endpoint to get posts.
      // You can use any data fetching library
      setLoading(!loading);
      const eventApi = await fetch(`${baseApiUrl}/event/[slug]`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: token || '',
        },
        body: JSON.stringify(data),
      });

      let result = await eventApi.json();
      if (
        result.status === 'success' &&
        result.message &&
        result.message === 'done' &&
        result.data
      ) {
        router.push({
          pathname: result.data.slug ? `/event/${result.data.slug}` : '/event',
        });
      } else {
        setStateFormMessage(result);
      }
      setLoading(false);
    }
  }

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

  function renderEventForm() {
    return (
      <>
        <Link
          href={{
            pathname: '/event',
          }}
        >
          <a>&larr; Back</a>
        </Link>
        <FormEvent
          onSubmit={onSubmitHandler}
          onChange={onChangeHandler}
          loading={loading}
          stateFormData={stateFormData}
          stateFormError={stateFormError}
          stateFormValid={stateFormValid}
          stateFormMessage={stateFormMessage}
        />
      </>
    );
  }

  async function deleteFetch(id){ 
    
    
    if(confirm("you want delete the event ?")
    ) {
      toast.error('Delete'),{
        
        position: "top-right ",
        autoclose: true,
        style:{
          background: "#000",
          color: "white",
        }
      }
        

      const eventApi = await fetch(`${baseApiUrl}/event/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: token || '',  
          }
          });       
           
      let result = await eventApi.json();
      console.log(result.message);
      if (result.status === 'success' ){         
        toast.success('The post was deleted successfully')      
        
      }
      
      router.push(`/event/`)
      
        
    }
  }
  <Toaster></Toaster>
  async function updateFetch (data){
    
    if(confirm("Are you sure you want to edit the post ?")){
      
        
      
      router.push({
        pathname:`/event/edit/${data.slug}`})

       
    }  
 
}
  function renderEventList() {
    return (
      <div className="card">
        <Link
          href={{
            pathname: '/event',
          }}
        >
          <a>&larr; Back</a>
        </Link>
        <h2
          className="sub-title"
          style={{
            display: 'block',
            marginTop: '.75rem',
          }}
        >
          {event.data.title}
          <small
            style={{
              display: 'block',
              fontWeight: 'normal',
              marginTop: '.75rem',
            }}
          >
            Posted: {event.data.createdAt}
          </small>
        </h2>
        <p>Description : {event.data.content}</p>
        <p>Email: {event.data.emailTo}</p>        
        <p>Start : {event.data.dateStart}</p>
        <p>End : {event.data.dateEnd}</p>
        <hr />
        By: {event.data.user.firstName || ''} {event.data.user.lastName || ''}
        {user &&
        <> 
        <button className="btn btn-block btn-warning" onClick= {() => deleteFetch (event.data.id) }
        >Delete</button>
        <button className="btn btn-block btn-warning" onClick={()=> updateFetch (event.data)}>Edit</button>
        </>
        
      }
      </div>
    );
  }

  return (
    <Layout
      title={`Next.js with Sequelize | event Page - ${event.data &&
        event.data.title}`}
      url={`${origin}${router.asPath}`}
      origin={origin}
    >
      <div className="container">
        <main className="content-detail">
          {router.asPath === '/event/add' ? renderEventForm() : renderEventList()}
        </main>
      </div>
    </Layout>
  );
}

/* getServerSideProps */
export async function getServerSideProps(context) {
  const { query, req } = context;
  const { origin } = absoluteUrl(req);

  const token = getAppCookies(req).token || '';
  const baseApiUrl = `${origin}/api`;

  let event = {};

  if (query.slug !== 'add') {
    const eventApi = await fetch(`${baseApiUrl}/event/${query.slug}`);
    event = await eventApi.json();
  }

  return {
    props: {
      origin,
      baseApiUrl,
      event,
      token,
    },
  };
}

export default Event;
