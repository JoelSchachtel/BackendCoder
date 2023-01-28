const addForm = document.getElementById('form-add-product');

addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const image = document.getElementById('image').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    
    fetch('http://localhost:8080/api/products/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            title,
            description,
            price: +price,
            thumbnails: image,
            code: Date.now(),
            stock,
            category,
            status: 'disponible'
        })
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(err =>{
        console.log(err);
        alert("Hubo un error, no se pudo agregar el producto");
    });
});