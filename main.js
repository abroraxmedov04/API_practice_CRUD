let url = "https://jsonplaceholder.typicode.com/comments";
let loading = document.querySelector(".lds-roller");
async function getData() {
  try {
    loading.style.display = "block";
    const response = await fetch(url);
    const data = await response.json();
    displayComments(data);
  } catch (error) {
    console.log("error =>", error);
  } finally {
    loading.style.display = "none";
  }
}
getData();

const tbody = document.querySelector("#tbody");
function displayComments(commentList) {
  tbody.innerHTML = "";
  commentList.forEach((comment, index) => {
    let template = `
      <tr>
        <th scope="row">${index + 1}</th>
        <td>${comment.name}</td>
        <td>${comment.email}</td>
        <td>
          <button class="btn-danger" onclick="deleteComment(${index})">Delete</button>
          <button class="btn-primary" onclick="editComment(${index})">Edit</button>
        </td>
      </tr>
    `;

    tbody.innerHTML += template;
  });
}

async function deleteComment(id) {
  const confirmation = confirm(`Are you sure you want to delete this comment?`);
  if (confirmation) {
    try {
      const response = await fetch(url + "/" + id, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete comment.");
      }
      console.log("Comment deleted successfully.", response.status);
      alert("deleted succesfuly");
      const data = await response.json();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }
}

let overlay = document.querySelector(".overlayContent");
let modal = document.querySelector(".modalContent");

async function editComment(id, updatedData) {
  modal.style.display = "block";
  overlay.style.display = "block";
  const editURL = `https://jsonplaceholder.typicode.com/comments/${id}`;
  try {
    const response = await fetch(editURL);
    const data = await response.json();
    let nameField = document.querySelector(".nameField");
    let emailField = document.querySelector(".emailField");
    nameField.value = data.name;
    emailField.value = data.email;
    console.log("Comment edited successfully.", response.status);
  } catch (error) {
    console.error("Error editing comment:", error);
  }
}

function hideModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
}

async function sendDataToServer(event) {
  event.preventDefault();
  let formData = new FormData(document.getElementById("commentForm"));
  try {
    let response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to add comment.");
    }
    alert("Comment added successfully!");
    document.getElementById("commentForm").reset();
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}
