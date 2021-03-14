let intervalId;

poll = (orderId) => {
    fetch(`/Coffee/${orderId}`)
        .then(response => {
            if (response.status === 200) {
                console.log("fired");
                    response.json().then(j => {
                        const statusDiv = document.getElementById("status");
                        console.log(j.update);
                        statusDiv.innerHTML = j.update;
                        if (j.finished)
                            clearInterval(intervalId);
                    });
                }
            }
        );
}

document.getElementById("submit").addEventListener("click", e => {
    e.preventDefault();
    const product = document.getElementById("product").value;
    const size = document.getElementById("size").value;
    console.log("triggered");
    fetch("/Coffee",
        {
            method: "POST",
            body: { product, size }
        })
        .then(response => response.text())
        .then(id => intervalId = setInterval(poll, 1000, id));
});