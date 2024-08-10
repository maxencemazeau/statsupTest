const historyFormattedDate = (historyDate, datePart = "") => {
    const today = new Date(historyDate);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const day = String(today.getDate()).padStart(2, '0');
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - startOfYear) / 86400000;
    const week = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

    const formats = {
        year: year,
        month: month,
        week: week,
        day: today,
        fullDate: `${year}-${month}-${day}`,
    };
    if (datePart === "") {
        return `${year}-${month}-${day}`
    } else {
        return formats[datePart]
    }
}

module.exports = { historyFormattedDate }