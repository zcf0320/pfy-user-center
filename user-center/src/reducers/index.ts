import { combineReducers } from 'redux';
import common from './common';
import user from './user';
import mall from './mall';
import service from './service';
import serviceItem from './serviceItem';
import claims from './claims';
import insurance from './insurance';

import article from './article';
import minApp from './minApp';
import inquire from './inquire';
import task from './task';
import claimsSettle from './claimsSettle';
import medicationReminder from './medicationReminder';
import healthy from './healthy';
// import claims from '../pages/claims/reducers';
export default combineReducers({
  common,
  user,
  mall,
  service,
  claims,
  article,
  insurance,
  minApp,
  inquire,
  task,
  claimsSettle,
  serviceItem,
  medicationReminder,
  healthy
});
