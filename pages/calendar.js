/* utils */
import { absoluteUrl, getAppCookies } from '../middleware/utils';
import Link from 'next/link';
import React, { useState } from 'react';
/* Calendar */
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
/* components */
import Layout from '../components/layout/Layout';
import UserNav from '../components/navigation/User';

import Router from 'next/router';


function MyCalendar(props) {
    const { user, events, origin } = props;
    //console.log(events.data);

    const localizer = momentLocalizer(moment);

    function allEvents(){
      return events.data
    }

    let myEvents = [];
    
    if (user === undefined){
      Router.push({
        pathname: '/user/login'
      });
    }else{
      myEvents = events.data.map((event) => {
        if (user.id === event.user.id){
          return {
            title : event.title,
            dateStart : event.dateStart,
            dateEnd : event.dateEnd
          }
        }
      })
    }

    const [selectEvent, setSelectEvent] = useState(allEvents);

    function onChangeHandler(e) {
      let selected = e.target.value;
      selected === 'allEvents' ? setSelectEvent(allEvents) : setSelectEvent(myEvents);     
    };
  

    return (
        <Layout
          title="Calendar"
        >
          <div className="container">
            <main>
              <UserNav props={{ user: user }} />
              <h2>
                <Link
                  href={{
                    pathname: '/',
                  }}
                >
                  <a>&larr; </a>
                </Link>
                Calendar
              </h2>
              <div style = {{
                marginTop: '10px',
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}>
              <label for="events">Mostrar </label>
              <select name="events" id="events" onChange = {(e) => onChangeHandler(e)}>
                <option value="allEvents">Todos los eventos</option> 
                <option value="myEvents">Mis eventos</option>                
              </select>
              </div>
              <div className="App">
                <Calendar
                  localizer={localizer}
                  defaultDate={new Date()}
                  defaultView="month"
                  events={selectEvent}
                  startAccessor={"dateStart"}
                  endAccessor={"dateEnd"}
                  style={{ height: 500 }}
                />
              </div>              
            </main>
          </div>            
        </Layout>
      );
}

/* getServerSideProps */
export async function getServerSideProps(context) {
    const { query, req } = context;
    const { nextPage } = query;
    const { origin } = absoluteUrl(req);

    const token = getAppCookies(req).token || '';

    const nextPageUrl = !isNaN(nextPage) ? `?nextPage=${nextPage}` : '';
    const baseApiUrl = `${origin}/api`;

    const eventsApi = await fetch(`${baseApiUrl}/event${nextPageUrl}`, {
        headers: {
          authorization: token || '',
        },
      });
    
    const events = await eventsApi.json();  
    return {
      props: {
        origin,
        events,
      },
    };
  }

export default MyCalendar;