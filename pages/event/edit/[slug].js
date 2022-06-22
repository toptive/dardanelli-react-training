import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

/* utils */
import { absoluteUrl, getAppCookies } from '../../../middleware/utils';

/* components */
import Layout from '../../../components/layout/Layout';
import FormEvent from '../../../components/form/FormEvent';

function Edit(props) {

  const { origin, event, token } = props;
  const { baseApiUrl } = props;
  

  /* post schemas */
  const FROM_DATA_EVENT = {
    title: {
      value: event.data.title,
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
      value: event.data.content,
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
      value: event.data.dateStart,
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
      value: event.data.dateEnd,
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

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stateFormData, setStateFormData] = useState(FROM_DATA_EVENT);
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
      const eventApi = await fetch(`${baseApiUrl}/event/${event.data.id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: token || '',
        },
        body: JSON.stringify(data),
      });
      let result = await eventApi.json();
      if (!(result.status === 'success' && result.message && result.message === 'done')){
        setStateFormMessage(result);
        window.alert("verify that you are logged and is the correct account")
      }
      else{
        alert("EVENT EDITED SUCCESSFULLY!")
      }
      setLoading(false);      
      router.push({
        pathname: '/event',
      });
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

  return (
    <Layout
        title={`Next.js with Sequelize | Event Page - ${event.data &&
          event.data.title}`}
        url={`${origin}${router.asPath}`}
        origin={origin}
      >
        <div className="container">
          <main className="content-detail">
            {router.asPath === `/event/edit/${event.data.slug}` ? renderEventForm() : '/event'}
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

export default Edit;
