import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Event from '../admin/event/event';
import PaymentList from '../admin/payment/PaymentList';
import EventList from '../admin/event/event_list';
import Staff from '../admin/staff/staff';

import Home from '../comps/Home';
import NotFound from '../comps/NotFound';
import User from '../comps/user/User';

const admin = (
    <Switch>
        <Route exact path={'/admin/dashboard'} component={Home} />
        <Route exact path={'/admin/events'} component={EventList} />
        <Route exact path={'/admin/events/:id'} component={Event} />
        <Route exact path={'/admin/members'} render={props => <User from="admin" {...props} />} />
        <Route exact path={'/admin/payments'} component={PaymentList} />
        <Route exact path={'/admin/users'} component={Staff} />
        <Route exact path={'*'} component={NotFound} />
    </Switch>
);

export default admin;
