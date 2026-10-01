var cl = console.log;

let postArr = [];

const postForm = document.getElementById("postForm");
const title = document.getElementById("title");
const content = document.getElementById("content");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const clearBtn = document.getElementById("clearBtn");
const postContainer = document.getElementById("postContainer");
const mainRow = document.getElementById("mainRow");
const formContainer = document.getElementById("formContainer");
const postContainerRow = document.getElementById("postContainerRow");
const spinner = document.getElementById("spinner");

const BASE_URL = `https://gaurav-1st-db-default-rtdb.firebaseio.com/`
// let POSTS_URL = `${BASE_URL}/fetchPosts.json`

//============================ Create ================================
function createNewStudent(eve) {
    let POSTS_URL = `${BASE_URL}/fetchPosts/.json`
    eve.preventDefault();
    let newPost = {
        title: title.value,
        content: content.value
    }
    showSpinner("text-success")
    fetch(POSTS_URL, {
        method: "POST",
        body: JSON.stringify(newPost)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {

            cl(data)
            let col = document.createElement("div")
            col.className = "col-10 offset-1 mt-1"
            col.id = data.name
            col.innerHTML = `<div class="card postContainer">
                    <div class="card-body p-3">
                        <div class="row">
                            <div class="col-11">
                                <h4><b> ${newPost.title} </b></h4>
                            </div>
                            <div class="col-8">
                                <p> ${newPost.content} </p>

                            </div>
                            <div class="col-3 offset-1 mt-5">
                                <button onClick="editPost(this)" class="btn btn-primary">Edit</button>
                                <button onClick="deletePost(this)" class="btn btn-danger">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>`

            postContainerRow.insertBefore(col, postContainerRow.children[1])
            postForm.reset()
            hideSpinner("text-success")
            showSnackBar("Added", "Post Added successfully!!!", "success")
        }).catch(err => {
            hideSpinner("text-success")
            showSnackBar("Error", "Something went wrong", "error")

            cl("Error")
        })
}
//============================ Read ================================
function fetchStudent(arr) {
    let POSTS_URL = `${BASE_URL}/fetchPosts/.json`
    showSpinner("text-primary")
    fetch(POSTS_URL, {
        method: "GET",
        body: null
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            for (const key in data) {
                data[key].id = key
                postArr.unshift(data[key])
            }
            let result = ""
            arr.forEach((ele, i) => {
                result += `<div class="col-10 offset-1 mt-1" id=${ele.id}>
                <div class="card postContainer">
                    <div class="card-body p-3">
                        <div class="row">
                            <div class="col-11">
                                <h4><b> ${ele.title}</b></h4>
                            </div>
                            <div class="col-8">
                                <p>${ele.content}</p>

                            </div>
                            <div class="col-3 offset-1 mt-5">
                                <button onClick="editPost(this)" class="btn btn-primary">Edit</button>
                                <button onClick="deletePost(this)" class="btn btn-danger">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
            });
            postContainerRow.innerHTML += result
            hideSpinner("text-primary")
        })
        .catch(err => {
            hideSpinner("text-primary")
            showSnackBar("Error", "Something went wrong", "error")
            cl("Error")
        })
}
fetchStudent(postArr)
//============================ Edit ================================
function editPost(ele) {
    let EDIT_ID = ele.closest(".col-10").id
    let EDIT_URL = `${BASE_URL}/fetchPosts/${EDIT_ID}.json`
    showSpinner("text-primary")
    fetch(EDIT_URL, {
        method: "GET",
        body: null
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTp Error  : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            localStorage.setItem("EDIT_ID", EDIT_ID)
            title.value = data.title
            content.value = data.content

            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
            hideSpinner("text-primary")

        })
        .catch(err => {
            hideSpinner("text-primary")
            showSnackBar("Error", "Something went wrong", "error")
            cl("Something went wrong")
        })
}
//============================ Update ================================
function updatePost(ele) {
    let UPDATE_ID = localStorage.getItem("EDIT_ID")
    let UPDATE_URL = `${BASE_URL}/fetchPosts/${UPDATE_ID}.json`

    let updatePostObj = {
        title: title.value,
        content: content.value,
        id: UPDATE_ID
    }

    showSpinner("text-success")
    fetch(UPDATE_URL, {
        method: "PATCH",
        body: JSON.stringify(updatePostObj)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json();
        })
        .then(data => {
            document.getElementById(UPDATE_ID).innerHTML = `  
            <div class="card postContainer">
                    <div class="card-body p-3">
                        <div class="row">
                            <div class="col-11">
                                <h4><b> ${data.title}</b></h4>
                            </div>
                            <div class="col-8">
                                <p>${data.content}</p>

                            </div>
                            <div class="col-3 offset-1 mt-5">
                                <button onClick="editPost(this)" class="btn btn-primary">Edit</button>
                                <button onClick="deletePost(this)" class="btn btn-danger">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>`

            addBtn.classList.remove("d-none")
            updateBtn.classList.add("d-none")

            postForm.reset()
            hideSpinner("text-success")
            showSnackBar("Updated", "Post updated successfully!!!", "success")
        })
        .catch(err => {
            hideSpinner("text-success")
            showSnackBar("Error", "Something went wrong", "error")
            cl("Error")
        });
}
//============================ Delete ================================
function deletePost(ele) {
    let DELETE_ID = ele.closest(".col-10").id
    let DELETE_URL = `${BASE_URL}/fetchPosts/${DELETE_ID}.json`

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            showSpinner("text-danger")
            fetch(DELETE_URL, {
                method: "DELETE",
                body: null
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP Error : ${res.status}`)
                    }
                    return res.json()
                })
                .then(data => {
                    let getIndex = postArr.findIndex(ele => ele.id === DELETE_ID)
                    postArr.splice(getIndex, 1)
                    ele.closest(".col-10").remove()
                    hideSpinner("text-danger")
                    showSnackBar("Deleted!", "Post removed successfully!!!", "success")
                })
                .catch(err => {
                    hideSpinner("text-danger")
                    showSnackBar("Error", "Something went wrong", "error")
                    cl("Error")
                })
        }
    });


}
function showSpinner(color) {
    spinner.classList.remove("d-none");
    spinner.classList.add(color);
}
function hideSpinner(color) {
    spinner.classList.add("d-none");
    spinner.classList.remove(color);
}
function showSnackBar(title, msg, error) {
    Swal.fire({
        title: title,
        text: msg,
        icon: error
    });
}
function clearForm() {
    postForm.reset()
}
postForm.addEventListener("submit", createNewStudent)
updateBtn.addEventListener("click", updatePost)
clearBtn.addEventListener("click", clearForm)
