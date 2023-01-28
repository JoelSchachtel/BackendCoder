let socket = io()
let user = ''
let chatBox = document.getElementById('chatbox')

Swal.fire({
    title: 'Autentificación de usuario',
    input: 'text',
    text: 'Elije tu nombre de usuario para el chat',
    inputValidator: value => {
        return !value.trim && 'Por favor, escribe un nombre de usuario!'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    document.getElementById('username').innerHTML = user
    socket = io()
})

chatBox.addEventListener('keyup', event => {
    if(event.key == 'Enter'){
        if(chatBox.value.trim().length > 0) {
            socket.emit('message', {
                user,
                message: chatBox.value
            })
            chatBox.value = ''
        }
    }
})

// Recibe los mensajes
socket.on('logs', data => {
    const divLog = document.getElementById('messageLogs')
    let messages = ''

    data.reverse().forEach(message => {
        messages += `<p><i>${message.user}</i>: ${message.message}</p>`
    });
    divLog.innerHTML = messages
})