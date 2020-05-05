// import moment from 'moment';
import moment from '../../node_modules/antd/node_modules/moment'; // temporary

export const log = (tag, funcName, env = 'development') => {
  if (env === 'development' && tag) {
    // const currentDateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    const currentDateTime = moment().format('h:mm:ss a');
    if (funcName) {
      console.log(
        `\n ${currentDateTime} <--- ${tag}__${funcName}() triggered --->`
      );
    } else {
      console.log(`\n ${currentDateTime} <--- ${tag} triggered --->`);
    }
  }
};
