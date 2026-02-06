const { format, addDays } = require('date-fns');

exports.getCurrentDate = () => {
    return new Date();
};

exports.formatDate = (date) => {
    return format(date, 'yyyy-MM-dd');
};
