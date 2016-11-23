import Reflux from 'Reflux';

let action = Reflux.createActions([
  "fetchUserInfo",
  "fetchMyActivities",
  "fetchCollections",
  "fetchRefunds",
  "fetchNonPayment",
  "resetSignup",
  "fetchCollections",
  "delCollection",
  "getCode",
  "verifyPhone"
]);

export default action;
