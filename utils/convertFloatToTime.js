const convertFloatToHour = (time) => {
    const hours = Math.floor(time); // Heures
    const minutes = Math.round((time - hours) * 60); // Minutes
    return { hours, minutes };
};

module.exports = { convertFloatToHour }