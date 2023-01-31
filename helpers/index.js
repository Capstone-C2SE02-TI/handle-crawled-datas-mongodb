const convertUnixTimestampToNumber = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);

    const year =
        date.getFullYear() < 10
            ? "0" + date.getFullYear()
            : "" + date.getFullYear();
    const month =
        date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : "" + (date.getMonth() + 1);
    const day =
        date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
    const hour =
        date.getHours() < 10 ? "0" + date.getHours() : "" + date.getHours();
    const minute =
        date.getMinutes() < 10
            ? "0" + date.getMinutes()
            : "" + date.getMinutes();
    const second =
        date.getSeconds() < 10
            ? "0" + date.getSeconds()
            : "" + date.getSeconds();

    const formattedTimeStr = `${year}${month}${day}${hour}${minute}${second}`;
    const formattedTimeNumber = Number(formattedTimeStr);

    return formattedTimeNumber;
};

const getTodayDay = () => {
    const date = new Date();

    const year =
        date.getFullYear() < 10
            ? "0" + date.getFullYear()
            : "" + date.getFullYear();
    const month =
        date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : "" + (date.getMonth() + 1);
    const day =
        date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();

    return Number(`${year}${month}${day}`);
};

const getThisMonthYear = () => {
    const date = new Date();

    const year =
        date.getFullYear() < 10
            ? "0" + date.getFullYear()
            : "" + date.getFullYear();
    const month =
        date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : "" + (date.getMonth() + 1);

    return Number(`${year}${month}`);
};

const getNearest7Days = () => {
    const unixTimestampToNumber = (unixTimestamp) => {
        const date = new Date(unixTimestamp);

        const year =
            date.getFullYear() < 10
                ? "0" + date.getFullYear()
                : "" + date.getFullYear();
        const month =
            date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : "" + (date.getMonth() + 1);
        const day =
            date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();

        return Number(`${year}${month}${day}`);
    };

    const dates = [6, 5, 4, 3, 2, 1, 0].map((i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return unixTimestampToNumber(d);
    });

    return dates;
};

const getNearest12Months = () => {
    var dates = [];
    (d = new Date()), (y = d.getFullYear()), (m = d.getMonth());

    function padMonth(month) {
        if (month < 10) return "0" + month;
        else return month;
    }

    if (m === 11) {
        for (var i = 1; i < 13; i++) {
            dates.push(Number(y + "" + padMonth(i)));
        }
    } else {
        for (var i = m + 1; i < m + 13; i++) {
            if (i % 12 > m) dates.push(Number(y - 1 + "" + padMonth(i + 1)));
            else dates.push(Number(y + "" + padMonth((i % 12) + 1)));
        }
    }

    return dates;
};

const eToLongStringNumber = (x) => {
    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split("e-")[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = "0." + new Array(e).join("0") + x.toString().substring(2);
        }
    } else {
        var e = parseInt(x.toString().split("+")[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += new Array(e + 1).join("0");
        }
    }

    return x;
};

const calculateFirstTransactionDate = (transactionHistory) => {
    const timeStamps = transactionHistory.map((TX) => TX.timeStamp);

    let min = timeStamps[0];

    for (let i = 1; i < timeStamps.length; i++) {
        if (timeStamps[i] < min) min = timeStamps[i];
    }

    if (min === "") return undefined;

    return convertUnixTimestampToNumber(min) || 0;
};

export {
    convertUnixTimestampToNumber,
    getTodayDay,
    getNearest7Days,
    getThisMonthYear,
    getNearest12Months,
    eToLongStringNumber,
    calculateFirstTransactionDate
};
