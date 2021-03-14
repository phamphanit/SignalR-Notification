pollWithTimeout = (url, options, timeout = 9000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);
}

//poll = (orderId) => {
//    pollWithTimeout(`/Coffee/${orderId}`)
//        .then(response => {
//            console.log("id triggered");
//                if (response.status === 200) {
//                    const statusDiv = document.getElementById("status");
//                    response.json().then(j => {
//                        console.log(j.update);
//                        statusDiv.innerHTML = j.update;
//                        if (!j.finished)
//                            poll(orderId);
//                    });
//                }
//            }
//        )
//        .catch(response => {
//            console.log("exception fired!")
//            console.log(response);
//            poll(orderId)
//        });
//}
poll = async (orderId) => {
    try {
        var response = await pollWithTimeout(`/Coffee/${orderId}`)
        console.log("id triggered");
        if (response.status === 200) {
            const statusDiv = document.getElementById("status");
            response.json().then(j => {
                console.log(j.update);
                statusDiv.innerHTML = j.update;
                if (!j.finished)
                    poll(orderId);
            });
        }
    }
    catch (err) {
        console.log("exception fired!")
        console.log(err);
        poll(orderId)
    }
}

document.getElementById("submit").addEventListener("click", e => {
    e.preventDefault();
    const product = document.getElementById("product").value;
    const size = document.getElementById("size").value;
    fetch("/Coffee",
        {
            method: "POST",
            body: { product, size }
        })
        .then(response => response.text())
        .then(text => poll(text));
});