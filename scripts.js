/*
--------------------------------------------------------------------------------------
Função para obter a lista existente do servidor via requisição GET
--------------------------------------------------------------------------------------
*/
const getList = async () => {
    let url = 'http://127.0.0.1:5000/produtos'
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.produtos.forEach(item => insertList(item.id, item.nome, item.quantidade, item.valor))
        })
        .catch((error) => {
            console.error('Error:', error)
        });        
}


/*
--------------------------------------------------------------------------------------
Chamada da função para carregamento inicial dos dados
--------------------------------------------------------------------------------------
*/
getList();


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
    const formData = new FormData();
    formData.append('nome', inputProduct);
    formData.append('quantidade', inputQuantity);
    formData.append('valor', inputPrice);

    let url = 'http://127.0.0.1:5000/produto';
    return fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error', error);
        });
}


/*
--------------------------------------------------------------------------------------
  Função para postar um comentário na lista do servidor via requisição POST
--------------------------------------------------------------------------------------
*/
const postComment = async (productId, inputComment) => {
    const formData = new FormData();
    formData.append('produto_id', productId)
    formData.append('texto', inputComment);
    
    let url = 'http://127.0.0.1:5000/comentario';
    try {
        const response = await fetch(url, {
            method: 'post',
            body: formData
        }); 
        if (!response.ok) {
            throw new Error('Failed to add comment');
        }
        return response.json();
    } catch (error) {
        console.error('Error', error);
    }    
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7")
    span.className = "close";
    span.appendChild(txt);
    parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById("myTable");
    let i;
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            let div = this.parentElement.parentElement;
            const nomeItem = div.getElementsByTagName('td')[1].innerHTML
            const idItem = div.getElementsByTagName('td')[0].innerHTML                     
            if (confirm("Você tem certeza?")) {
                div.remove();
                deleteItem(nomeItem);
                deleteComment(idItem);                                           
                alert("Removido!");
            }
        }
    }
}


/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
    console.log(item)
    let url = 'http://127.0.0.1:5000/produto?nome=' + item;
    fetch(url, {
        method: 'delete'
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log('Error:', error);
        });
}


/*
  --------------------------------------------------------------------------------------
  Função para deletar um comentário da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteComment = (produtoId) => {
    console.log(produtoId)
    let url = 'http://127.0.0.1:5000/comentario?produto_id=' + produtoId;
    fetch(url, {
        method: 'delete'
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log('Error:', error);
        });
};


/*
--------------------------------------------------------------------------------------
Função para adicionar um novo comentário, apenas se algo foi inserido no campo.
--------------------------------------------------------------------------------------
*/
const newComment = (productId) => {
    let inputComment = document.getElementById("newComment").value;    

    if (inputComment === '') {
        // Se o input estiver vazio, não faz nada        
    } else {        
        postComment(productId, inputComment);
    }
}


/*
--------------------------------------------------------------------------------------
Função para adicionar um novo item com id, nome, quantidade e valor 
--------------------------------------------------------------------------------------
*/
const newItem = () => {
    let inputId = document.getElementById("newId").value;
    let inputProduct = document.getElementById("newInput").value;
    let inputQuantity = document.getElementById("newQuantity").value;
    let inputPrice = document.getElementById("newPrice").value;
    
    if (isNaN(inputId)) {
        alert("Id precisa ser número!");
    } else if (inputProduct === '') {
        alert("Escreva o nome de um item!")        
    } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
        alert("Quantidade e valor precisam ser números!");
    } else {
        postItem(inputProduct, inputQuantity, inputPrice)
        .then(response => {
            const productId = response.id;
            insertList(inputId, inputProduct, inputQuantity, inputPrice);
            alert("Item adicionado!")
            newComment(productId);
        })
        .catch(error => {
            console.error('Error', error);
        });
    }
} 
 

/*
--------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
--------------------------------------------------------------------------------------
*/
const insertList = (idProduct, nameProduct, quantity, price) => {
    var item = [idProduct, nameProduct, quantity, price]
    var table = document.getElementById('myTable');
    var row = table.insertRow();

    for (var i = 0; i < item.length; i++) {
        var cel = row.insertCell(i);
        cel.textContent = item[i];
    }

    insertButton(row.insertCell(-1))
    document.getElementById('newId').value = "";
    document.getElementById('newInput').value = "";
    document.getElementById('newQuantity').value = "";
    document.getElementById('newPrice').value = "";

    removeElement();        
}


/*
  --------------------------------------------------------------------------------------
  Ativando plugin simple anime.
  --------------------------------------------------------------------------------------
*/
if(window.SimpleAnime) {
    new SimpleAnime();
}
