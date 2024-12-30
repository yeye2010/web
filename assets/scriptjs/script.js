'use strict';

// script.js

document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.btn-action.agregar-carrito');
    const lista = document.querySelector("#lista-carrito tbody");
    const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
    const carrito = document.querySelector("#carrito");
    const heartButton = document.getElementById("heart-button");
    const countDisplay = heartButton.querySelector('.count');
    const togglePanel = document.getElementById("toggleMessage");
    const originalContent = togglePanel.innerHTML;
    const newContent = `
      <h1>Bienvenido, tu tienda te espera.</h1>
      <p>Estamos aquí para ofrecerte la mejor ayuda, tu opinión y experiencia es muy importante para nosotros. 
      Por favor, comparte tus comentarios para ayudarnos a mejorar y brindarte un mejor servicio. ¡Gracias por tu colaboración!</p>
      <a href="https://wa.me/573128462035" target="_blank" class="primary"> CONTÁCTENOS</a>
    `;

    togglePanel.addEventListener("mouseenter", function() {
        togglePanel.innerHTML = newContent;
    });

    togglePanel.addEventListener("mouseleave", function() {
        togglePanel.innerHTML = originalContent;
    });


    // Contador de elementos en el carrito
    let cartItemCount = 0;

    function cargarEventListeners() {
        // Asignar el evento de click a cada botón de agregar al carrito
        addToCartButtons.forEach(button => {
            button.addEventListener('click', comprarElemento);
        });

        // Asignar eventos para eliminar elementos y vaciar carrito
        carrito.addEventListener("click", eliminarElemento);
        vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
    }

    function comprarElemento(e) {
        e.preventDefault();
        // Encontrar el contenedor del producto al que pertenece el botón
        const producto = e.target.closest('.showcase');
        leerDatosProducto(producto);
    }

    function leerDatosProducto(producto) {
        const infoProducto = {
            imagen: producto.querySelector(".product-img.default").src,
            titulo: producto.querySelector(".showcase-title").textContent,
            id: producto.dataset.id
        };
        insertarCarrito(infoProducto);
    }

    function insertarCarrito(producto) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width="100">
            </td>
            <td>
                ${producto.titulo}
            </td>
            <td>
                <a href="#" class="borrar" data-id="${producto.id}">X</a>
            </td>
        `;
        lista.appendChild(row);
        actualizarContador(1);
    }

    function eliminarElemento(e) {
        e.preventDefault();
        if (e.target.classList.contains("borrar")) {
            e.target.closest('tr').remove();
            actualizarContador(-1);
        }
    }

    function vaciarCarrito(e) {
        e.preventDefault();
        while (lista.firstChild) {
            lista.removeChild(lista.firstChild);
        }
        cartItemCount = 0;
        countDisplay.textContent = cartItemCount;
    }

    function actualizarContador(count) {
        cartItemCount += count;
        countDisplay.textContent = cartItemCount;
    }

    // Inicia los event listeners
    cargarEventListeners();
});

// modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

// modal function
const modalCloseFunc = function () { modal.classList.add('closed') }

// modal eventListener
modalCloseOverlay.addEventListener('click', modalCloseFunc);
modalCloseBtn.addEventListener('click', modalCloseFunc);

// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
toastCloseBtn.addEventListener('click', function () {
  notificationToast.classList.add('closed');
});

// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

  // mobile menu function
  const mobileMenuCloseFunc = function () {
    mobileMenu[i].classList.remove('active');
    overlay.classList.remove('active');
  }

  mobileMenuOpenBtn[i].addEventListener('click', function () {
    mobileMenu[i].classList.add('active');
    overlay.classList.add('active');
  });

  mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
  overlay.addEventListener('click', mobileMenuCloseFunc);

}

// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

  accordionBtn[i].addEventListener('click', function () {

    const clickedBtn = this.nextElementSibling.classList.contains('active');

    for (let i = 0; i < accordion.length; i++) {

      if (clickedBtn) break;

      if (accordion[i].classList.contains('active')) {

        accordion[i].classList.remove('active');
        accordionBtn[i].classList.remove('active');

      }

    }

    this.nextElementSibling.classList.toggle('active');
    this.classList.toggle('active');

  });

}

// Obtener el botón de cerrar para "LOS MÁS VENDIDOS"
const showcaseCloseBtn = document.querySelector('[data-showcase-close-btn]');
const showcaseSection = document.querySelector('.product-showcase');

// Función para cerrar la sección "LOS MÁS VENDIDOS"
const showcaseCloseFunc = function () {
  showcaseSection.classList.add('closed');
};

const commentForm = document.getElementById('commentForm');
const commentsContainer = document.getElementById('commentsList');
const commentCountElement = document.getElementById('commentCount');
const formFeedback = document.getElementById('formFeedback');

loadComments();

commentForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const email = document.getElementById('email').value;
  const formFeedback = document.getElementById('formFeedback');

  if (!name || !message || !email) {
    formFeedback.textContent = "Todos los campos son obligatorios.";
    document.querySelectorAll('.input-field').forEach(field => {
        if (!field.value) {
            field.style.border = '1px solid red';
        } else {
            field.style.border = '1px solid #ddd';
        }
    });
    return;
}

  const comment = {
    id: Date.now(),
    name,
    message,
    email,
    date: new Date().toLocaleString(),
    replies: []
  };

  saveComment(comment);
  addCommentToPage(comment);
  commentForm.reset();
  formFeedback.textContent = "Comentario enviado exitosamente";
  formFeedback.classList.add('success-feedback', 'show');
  updateCommentCount(); 

  setTimeout(() => {
    formFeedback.classList.remove('show');
  }, 3000); // El mensaje desaparece después de 3 segundos
});

function saveComment(comment) {
  let comments = localStorage.getItem('comments');
  comments = comments ? JSON.parse(comments) : [];
  comments.push(comment);
  localStorage.setItem('comments', JSON.stringify(comments));
  updateCommentCount();
}

function loadComments() {
  let comments = localStorage.getItem('comments');
  if (comments) {
    comments = JSON.parse(comments);
    comments.forEach(comment => addCommentToPage(comment));
    updateCommentCount();
  }
}

function addCommentToPage(comment, parentElement = commentsContainer) {
  const isOwner = comment.email === 'elizabeth4756l@gmail.com';
  const commentElement = document.createElement('div');
  commentElement.classList.add('comment');
  if (isOwner) {
    commentElement.classList.add('comment-owner');
  }
  commentElement.dataset.id = comment.id;
  commentElement.innerHTML = `
    <small>${comment.date}</small>
    <h4>${comment.name}</h4>
    <p>${comment.message}</p>
    <div class="comment-actions">
      <button class="reply-btn">Responder</button>
      <button class="delete-btn">Eliminar</button>
      <button class="show-replies-btn" data-replies-count="${comment.replies.length}">
          ${comment.replies.length} respuestas
      </button>
    </div>
    <div class="comment-replies"></div>
  `;
  parentElement.appendChild(commentElement);

  const replyBtn = commentElement.querySelector('.reply-btn');
  const deleteBtn = commentElement.querySelector('.delete-btn');
  const showRepliesBtn = commentElement.querySelector('.show-replies-btn');
  const repliesContainer = commentElement.querySelector('.comment-replies');

  replyBtn.addEventListener('click', () => {
    const replyForm = createReplyForm(comment.id);
    commentElement.appendChild(replyForm);
  });

  deleteBtn.addEventListener('click', () => {
    deleteComment(comment.id);
    commentElement.remove();
    updateCommentCount(); // Asegúrate de llamar a la función para actualizar el contador
});


  // Función para manejar el despliegue de respuestas y actualizar el texto del botón
  showRepliesBtn.addEventListener('click', () => {
    repliesContainer.classList.toggle('active');
  });
  
  comment.replies.forEach(reply => addCommentToPage(reply, repliesContainer));
}

function updateRepliesCount(commentId) {
  let commentElement = document.querySelector(`.comment[data-id="${commentId}"]`);
  let showRepliesBtn = commentElement.querySelector('.show-replies-btn');
  let repliesCount = parseInt(showRepliesBtn.getAttribute('data-replies-count')) + 1;
  showRepliesBtn.setAttribute('data-replies-count', repliesCount);
  showRepliesBtn.textContent = `${repliesCount} respuestas`;
}

function createReplyForm(commentId) {
  const replyForm = document.createElement('form');
  replyForm.classList.add('reply-form');
  replyForm.innerHTML = `
    <div class="input-wrapper">
      <label for="replyName">Tu nombre*</label>
      <input type="text" name="replyName" placeholder="Tu nombre" required class="input-field">
    </div>
    <div class="input-wrapper">
      <label for="replyEmail">Tu correo electrónico*</label>
      <input type="email" name="replyEmail" placeholder="Tu correo electrónico" required class="input-field">
    </div>
    <div class="input-wrapper">
      <label for="replyMessage">Respuesta*</label>
      <textarea name="replyMessage" placeholder="Escriba su respuesta" required class="input-field"></textarea>
    </div>
    <button type="submit" class="btn btn-primary">
      <span>Responder</span>
      <ion-icon name="send-outline"></ion-icon>
    </button>
  `;

  replyForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const replyName = replyForm.querySelector('input[name="replyName"]').value;
    const replyEmail = replyForm.querySelector('input[name="replyEmail"]').value;
    const replyMessage = replyForm.querySelector('textarea[name="replyMessage"]').value;

    const reply = {
      id: Date.now(),
      name: replyName,
      email: replyEmail,
      message: replyMessage,
      date: new Date().toLocaleString(),
      replies: []
    };

    addReply(commentId, reply);
    replyForm.remove();
  });

  return replyForm;
}

function addReply(commentId, reply) {
  let comments = JSON.parse(localStorage.getItem('comments'));

  function findComment(comments, commentId) {
    for (let comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.replies.length > 0) {
        let found = findComment(comment.replies, commentId);
        if (found) return found;
      }
    }
    return null;
  }

  let parentComment = findComment(comments, commentId);
    if (parentComment) {
        parentComment.replies.push(reply);
        localStorage.setItem('comments', JSON.stringify(comments));
        
        // Añadir respuesta a la página de forma instantánea
        let parentElement = document.querySelector(`.comment[data-id="${commentId}"] .comment-replies`);
        addCommentToPage(reply, parentElement);
        
        // Actualizar contador de respuestas instantáneamente
        updateRepliesCount(commentId);
    }
}

// En la función deleteComment, llama a updateRepliesCount() si eliminas un comentario con respuestas.
function deleteComment(commentId) {
  let comments = JSON.parse(localStorage.getItem('comments'));

  function removeComment(comments, commentId) {
    return comments.filter(comment => {
      if (comment.id === commentId) {
        return false; // Eliminar el comentario encontrado
      }
      // Si el comentario tiene respuestas, eliminarlas recursivamente
      comment.replies = removeComment(comment.replies, commentId);
      return true;
    });
  }

  comments = removeComment(comments, commentId);
  localStorage.setItem('comments', JSON.stringify(comments));

  // Actualiza el número de comentarios después de la eliminación
  updateCommentCount();
}

// Corrige el total de comentarios y respuestas en la función updateCommentCount
function updateCommentCount() {
  const comments = JSON.parse(localStorage.getItem('comments')) || [];

  // Contar todos los comentarios y respuestas recursivamente
  function countAllComments(comments) {
    let count = 0;
    comments.forEach(comment => {
      count++;
      count += countAllComments(comment.replies); // Sumar respuestas
    });
    return count;
  }

  const totalComments = countAllComments(comments); 
  commentCountElement.textContent = `Número de comentarios: ${totalComments}`; // Actualizar el DOM
}


function updateRepliesCount(commentId) {
  let commentElement = document.querySelector(`.comment[data-id="${commentId}"]`);
  let showRepliesBtn = commentElement.querySelector('.show-replies-btn');
  let repliesCount = parseInt(showRepliesBtn.getAttribute('data-replies-count')) + 1;
  showRepliesBtn.setAttribute('data-replies-count', repliesCount);
  showRepliesBtn.textContent = `${repliesCount} respuestas`;
  updateCommentCount();
}

    