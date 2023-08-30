import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../comps/Home';
import NotFound from '../comps/NotFound';
import User from '../comps/user/User';
import Attendance from '../operator/attendance/Attendance';
import AttendanceScreen from '../operator/attendance/AttendanceScreen';
import EventPackage from '../operator/EventPackage';
import PollList from '../operator/poll/PollList';
import PollScreen from '../operator/poll/PollScreen';
import QuestionList from '../operator/question/QuestionList';
import QuestionScreen from '../operator/question/QuestionScreen';

const operator = (
    <Switch>
        <Route exact path={'/operator'} component={Home} />
        <Route
            exact
            path={'/operator/members'}
            render={props => <User from="operator" {...props} />}
        />
        <Route exact path={'/operator/attendance'} component={Attendance} />
        <Route
            exact
            path={'/operator/attendance/screen/:program/:bucket'}
            component={AttendanceScreen}
        />
        <Route
            exact
            path={'/operator/question/screen/:event/:program'}
            component={QuestionScreen}
        />
        <Route exact path={'/operator/poll/screen/:program/:poll'} component={PollScreen} />
        <Route exact path={'/operator/question'} component={QuestionList} />
        <Route exact path={'/operator/poll'} component={PollList} />
        <Route exact path={'/operator/package'} component={EventPackage} />
        <Route exact path={'*'} component={NotFound} />
    </Switch>
);

export default operator;
