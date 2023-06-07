import { isUserAuthorization, createComment } from "./api.js";
import {initApp} from "./main.js";
import {renderLogin} from "./renderLogin.js"

const getListCommentsEdit = (comment, index) => {
  let likeClass = comment.active ? "-active-like" : "";
     return `<li class="comment">
           <div class="comment-header">
             <div id ="name">${comment.name}</div>
             <div>${comment.date} </div>
           </div>
           <div class="comment-body">
             <div id = "text" data-index="${index}" class="comment-text" style={{ whiteSpace: 'pre-line' }}>
               ${comment.text}
             </div>
           </div>
           <div class="comment-footer">
             <button data-index="${index}" class="edited-button">Редактировать</button>
             <div class="likes">
               <span class="likes-counter">${comment.like}</span> ${comment.like === 1 ? 'лайк' : 'лайков'}
               <button data-index="${index}" class="like-button ${likeClass}"></button> 
             </div>
           </div>
         </li>`
}


export const renderComments = ({comments, handleCommentEditClick, handleCommentFeedbackClick, handleCommentLikeClick}) => {
  const appEl = document.getElementById("app");
  const nameUser = localStorage.getItem('user');
  if (!isUserAuthorization())  {
    renderLogin({
      appEl,
      initApp,
    });
    return
  }
  const commentsHtml = comments.map((comment, index) => getListCommentsEdit(comment, index))
  .join('');
  const appHtml = `
  <div class="container" id="container" >
  <div id="commentsContainer">
    <ul id="list" class="comments">
    ${commentsHtml}
    </ul>
    <div class="add-form" id="form-comment">
      <input id="name-input"
        type="text"
        class="add-form-name"
        placeholder="Введите ваше имя"
        value = "${nameUser}"
      />
      <textarea id="comment-input"
        type="textarea"
        class="add-form-text"
        placeholder="Введите ваш коментарий"
        rows="4"
      ></textarea>
      <div class="add-form-row">
        <button id="button" class="add-form-button">Написать</button>
      </div>
    </div>
  </div>
  </div>`
     appEl.innerHTML = appHtml;
     const buttonElement = document.getElementById("button")
  const addComment = () => { 
    const buttonElement = document.getElementById("button")
    buttonElement.addEventListener("click", () => {
    const commentForm = document.getElementById("form-comment");
    const commentInputElement = document.getElementById("comment-input");
    commentForm.style.display = 'none';
    const commentAddingMessage = document.createElement('div'); 
    commentAddingMessage.innerText = 'Комментарий добавляется...';
    commentForm.parentNode.insertBefore(commentAddingMessage, commentForm); 
        
    commentInputElement.classList.remove("error");
    if (commentInputElement.value === "" && commentInputElement.value.length < 3) {
        commentInputElement.classList.add("error");
        return;
        }
    createComment(commentInputElement.value)      
    .then(() => {
      initApp();
    })
    .then((data) => {
      commentAddingMessage.style.display = 'none';
      commentForm.style.display = 'block';
      commentInputElement.value = "";
    })
    .catch((error) => {
      commentAddingMessage.style.display = "none";
      commentForm.style.display = "block";
      if (error.message === "Неверный запрос") {
        alert("Комментарий должен быть не короче 3-х символов");
      } 
      if (error.message === "Сервер упал") {
        alert("Извините сервер сломался, попробуйте позже");
      }
      else {
        alert("Отсутствует подключение к сети, попробуйте позже!");
      }
      console.warn(error);
    });
  });
  }
  addComment();
      onCommentLikeClick(handleCommentLikeClick);
      onCommentEditClick(handleCommentEditClick);
      onCommentFeedbackClick(handleCommentFeedbackClick);
   }
export const onCommentLikeClick = (handleCommentLikeClick) => {
    const likeButtonsElements = document.querySelectorAll(".like-button");
    for (const likeButtonsElement of likeButtonsElements) {
      likeButtonsElement.addEventListener("click", handleCommentLikeClick);
    }
  };
export const onCommentEditClick = (handleCommentEditClick) => { 
    const editButtonsElements = document.querySelectorAll(".edited-button"); 
    for (const editButtonElement of editButtonsElements) { 
      editButtonElement.addEventListener("click", handleCommentEditClick);
    } 
  };
export const onCommentFeedbackClick = (handleCommentFeedbackClick) => {  
    const feedbackButtonsElements = document.querySelectorAll(".comment-text");   
    for (const feedbackButtonsElement of feedbackButtonsElements) {   
      feedbackButtonsElement.addEventListener("click", handleCommentFeedbackClick);  
    }  
  };
