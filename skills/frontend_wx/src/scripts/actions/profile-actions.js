import Reflux from 'Reflux';

let action = Reflux.createActions([
  "fetchUserInfo",
  "fetchMyActivities",
  "fetchCollections",
  "fetchRefunds",
  "postRefund",
  "fetchNonPayment",
  "resetSignup",
  "fetchCollections",
  "delCollection",
  "getCode",
  "verifyPhone",
  "fetchComment",
  "postComment"
]);

export default action;
