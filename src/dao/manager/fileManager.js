import fs from 'fs';

class FileManager{
    constructor(path){
        this.products=new Array();
        this.path=path;
        this.format = 'utf-8';
    }

    getNextId(){
        let size = this.products.length
        return size > 0 ? this.products[size-1].id + 1 : 1 
    }   

    #newProduct(id,title,description,price,code,stock, category, status, thumbnails){
        const newProduct={
            id: id,
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status
        }
        return newProduct;
    }

    #errorCheck(newProduct, operation){
        const errors=new Array();
        if (operation == "add") {
            this.products.forEach(element => {if (element.code == newProduct.code) errors.push(`Code "${newProduct.code}" ya existe.`)})
        }
        if (Object.values(newProduct).includes(undefined)) errors.push('Todos los campos son obligatorios.')
        return errors
    }

    async #getIndex(id){
        let index;
        let product = await this.getById(id)        
        if (product != "No existe un producto con ese ID.") index=this.products.indexOf(product) 
        else return; 
        return index
    }

    async add(title,description,price,code,stock, category, status = true, thumbnails = []){
        await this.get()
        const newProduct= this.#newProduct(this.getNextId(),title,description,price,code,stock, category, status, thumbnails)
        const errors = this.#errorCheck(newProduct,"add")
        return errors.length == 0 ? (this.products.push(newProduct), await fs.promises.writeFile(this.path, JSON.stringify(this.products)),newProduct) : {error: errors}
        
    }

    get = async () => {
        try{
            let content=await fs.promises.readFile(this.path,this.format)
            this.products = JSON.parse(content)
            return this.products
        }
        catch(err){
            return "No se pudo obtener ningún producto."
        }
        
    }

    getById = async (id) => {
        await this.get()
        return this.products.find(product => product.id == id) || "No existe un producto con ese ID.";
        
    }
    
    updateById = async (id,title,description,price,code,stock, category, status = true, thumbnails = []) => {
        const index = await this.#getIndex(id)
        const updatedProduct= this.#newProduct(id,title,description,price,code,stock, category, status, thumbnails)
        const errors = this.#errorCheck(updatedProduct, "update")
        if (!index) errors.push("No existe un producto con ese ID.")
        return errors.length == 0 ? (this.products[index]=updatedProduct, await fs.promises.writeFile(this.path, JSON.stringify(this.products)),updatedProduct) : errors
        
    }

    deleteById = async (id) => {
        const index = await this.#getIndex(id)
        if (index) return (this.products.splice(index, 1), await fs.promises.writeFile(this.path, JSON.stringify(this.products)),{message: "Realizado con éxito."})
        else return {error: "No existe un producto con ese ID."}
        
    }
}

// module.exports = FileManager;

export default FileManager;