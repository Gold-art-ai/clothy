export default {
    send: ({to, subject, text, bookingId}) => {
        console.log("NOTIFIER STUB: ", {to, subject, text, bookingId});
        return Promise.resolve(true);

}
}