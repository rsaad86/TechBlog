async function handleBlogUpdate(event) {
  event.preventDefault();
  console.log("update");

  //Obtain title and content from the url
  const title = document
    .querySelector('textarea[name="blog-title"]')
    .value.trim();
  const content = document
    .querySelector('textarea[name="blog-content"]')
    .value.trim();
  const id = document.location.toString().split("/")[
    document.location.toString().split("/").length - 1
  ];

  //Server Update Request
  if (title && content) {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    });

    //If the response is ok, got to the mainpage
    if (response.ok) {
      document.location.replace("/mainpage");
    } else {
      alert(response.statusText);
    }
  } else {
    //alert user of error
    alert("You must enter a title and content for your blog.");
  }
}

async function handleBlogDelete(event) {
  event.preventDefault();

  const id = document.location.toString().split("/")[
    document.location.toString().split("/").length - 1
  ];

  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });

  //Goes to the mainpage if the delete request was successful
  if (response.ok) {
    document.location.replace("/mainpage");
  } else {
    alert(response.statusText);
    document.location.replace("/login");
  }
}

document
  .querySelector(".blog-form")
  .addEventListener("submit", handleBlogUpdate);
document
  .querySelector(".delete-btn")
  .addEventListener("click", handleBlogDelete);
