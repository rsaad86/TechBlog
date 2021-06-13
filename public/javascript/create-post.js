async function handleCreateNewBlog(event) {
  event.preventDefault();

  //Get the title and content from the form
  const title = document
    .querySelector('textarea[name="blog-title"]')
    .value.trim();
  const content = document
    .querySelector('textarea[name="blog-content"]')
    .value.trim();

  //Send update to server if title and content have been written
  if (title && content) {
    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    });

    //If response is ok, got to the mainpage
    if (response.ok) {
      document.location.replace("/mainpage");
    } else {
      alert(response.statusText);
      document.location.replace("/login");
    }
  } else {
    //Alert user of error
    alert("Must enter a title and content for your blog.");
  }
}

document
  .querySelector(".blog-form")
  .addEventListener("submit", handleCreateNewBlog);
