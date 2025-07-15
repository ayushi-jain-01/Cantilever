let editId = null;

// Show/hide blog form
function showCreateForm() {
  document.getElementById("createForm").classList.remove("hidden");
}

function hideCreateForm() {
  document.getElementById("createForm").classList.add("hidden");
  clearForm();
  editId = null;
}

function clearForm() {
  document.getElementById("newTitle").value = "";
  document.getElementById("newContent").value = "";
  document.getElementById("newAuthor").value = "";
}

// Fetch and display blogs
async function fetchBlogs() {
  const wrapper = document.getElementById("blogsWrapper");
  wrapper.innerHTML = "";

  try {
    const res = await fetch("/api/blogs");
    const blogs = await res.json();

    blogs.forEach(blog => {
      const card = document.createElement("div");
      card.classList.add("blog-card");
      card.innerHTML = `
        <h3>${blog.title}</h3>
        <p>${blog.content}</p>
        <small>Author: ${blog.author}</small>
        <div class="blog-buttons">
          <button class="view-btn" onclick="viewBlog('${blog._id}')"><i class="fas fa-eye"> </i> </button>
          <button class="edit-btn" onclick="editBlog('${blog._id}')"><i class="fas fa-edit"> </i></button>
          <button class="delete-btn" onclick="deleteBlog('${blog._id}')"><i class="fa fa-trash"> </i></button>
        </div>
      `;
      wrapper.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    alert("Error loading blogs.")
  }
}

// Create or update blog
async function addBlog() {
  const title = document.getElementById("newTitle").value.trim();
  const content = document.getElementById("newContent").value.trim();
  const author = document.getElementById("newAuthor").value.trim();

  if (!title || !content || !author) {
    alert("Please fill all fields.");
    return;
  }

  const blogData = { title, content, author };

  try {
    let res;
    if (editId) {
      res = await fetch(`/api/blogs/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(blogData)
      });
    } else {
      res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(blogData)
      });
    }

    if (res.ok) {
      alert(editId ? "Blog updated!" : "Blog created!");
      hideCreateForm();
      fetchBlogs();
    } else {
      alert("Something went wrong.");
    }
  } catch (err) {
    console.error("Submit blog error:", err);
  }
}

// View blog details
async function viewBlog(id) {
  try {
    const res = await fetch(`/api/blogs/${id}`);
    const blog = await res.json();
    alert(`📖 Title: ${blog.title}\n📝 Content: ${blog.content}\n👤 Author: ${blog.author}`);
  } catch (err) {
    alert("Error fetching blog");
  }
}

// Edit blog
async function editBlog(id) {
  try {
    const res = await fetch(`/api/blogs/${id}`);
    const blog = await res.json();

    document.getElementById("newTitle").value = blog.title;
    document.getElementById("newContent").value = blog.content;
    document.getElementById("newAuthor").value = blog.author;

    editId = id;
    showCreateForm();
  } catch (err) {
    alert("Error loading blog for editing");
  }
}

// Delete blog
async function deleteBlog(id) {
  if (!confirm("Are you sure you want to delete this blog?")) return;

  try {
    const res = await fetch(`/api/blogs/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("Blog deleted.");
      fetchBlogs();
    } else {
      alert("Delete failed.");
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
}

// Run on page load
window.onload = fetchBlogs;