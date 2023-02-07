let socket = io()
let user = ""
let chatBox = document.getElementById("chatbox")

Swal.fire({
    title: 'Authentication',
    input: 'text',
    text: 'Elija el nombre para usar en el chat:',
    inputValidator: value => {
        return !value.trim() && 'Por favor, escriba un nombre!'
    },
    allowOutsideClick: false
}).then( result => {
    user = result.value
    document.getElementById('username').innerHTML = user
    socket = io()
})

//Enviar mensajes
chatBox.addEventListener("keyup", event => {
    if(event.key == "Enter"){
        if(chatBox.value.trim().length > 0){
            socket.emit("message", {
                user,
                message: chatBox.value
            })
            chatBox.value = ""
        }
    }
})

//Recibir Mensajes
socket.on("logs", data => {
    const divLog = document.getElementById("messageLogs")
    let messages = ""

    data.reverse().forEach(message => {
        messages += `<p><i>${message.user}</i>: ${message.message}</p>`
    });
    divLog.innerHTML = messages
})