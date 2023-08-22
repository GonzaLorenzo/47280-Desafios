const socket = io();

const form = document.getElementById('formProduct')

form.addEventListener('submit', (e) =>
{
    e.preventDefault()

    const datForm = new FormData(e.target)
    const newProd = Object.fromEntries(datForm)
    socket.emit('newProduct', newProd)

    e.target.reset()
})