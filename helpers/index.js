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

const scientificNotationEToLongStringNumber = (x) => {
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

module.exports = {
    convertUnixTimestampToNumber,
    scientificNotationEToLongStringNumber,
};
