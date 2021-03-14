listen = (id) => {
    const socket = new WebSocket(`ws://localhost:60907/Coffee/${id}`);

    socket.onmessage = event => {
        console.log("NEW detected");
        console.log(JSON.parse(event.data));
        const statusDiv = document.getElementById("status");
        statusDiv.innerHTML = JSON.parse(event.data);
    };
}

document.getElementById("submit").addEventListener("click", e => {
    e.preventDefault();
    console.log("ORDER fired");
    const product = document.getElementById("product").value;
    const size = document.getElementById("size").value;
    fetch("/Coffee",
        {  
            method: "POST",
            body: { product, size }
        })
        .then(response => response.text())
        .then(text => listen(text));
});