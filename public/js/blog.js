$(document).ready(function() {
  /* global moment */

  // blogContainer holds all of our posts
  var blogContainer = $(".blog-container");
  var postCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
  // Variable to hold our posts
  var posts;

  // The code below handles the case where we want to get blog posts for a specific author
  // Looks for a query param in the url for author_id
  var url = window.location.search;
  var authorId;
  if (url.indexOf("?author_id=") !== -1) {
    authorId = url.split("=")[1];
    getPosts(authorId);
  }
  // If there's no authorId we just get all posts as usual
  else {
    getPosts();
  }


  // This function grabs posts from the database and updates the view
  function getPosts(author) {
    authorId = author || "";
    if (authorId) {
      authorId = "/?author_id=" + authorId;
    }
    $.get("/api/posts" + authorId, function(data) {
      console.log("Posts", data);
      posts = data;
      if (!posts || !posts.length) {
        displayEmpty(author);
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete posts
  function deletePost(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/posts/" + id
    })
      .then(function() {
        getPosts(postCategorySelect.val());
      });
  }

  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      $('<img>').attr('src','img/cloud-lg1.png').css('position','absolute').css('top',((i*922)%250)+220).css('left',i*1120+200).appendTo('#parallax-bg2');
      $('<img>').attr('src','img/cloud-lg2.png').css('position','absolute').css('top',((i*933)%250)+110).css('left',i*1310+150).appendTo('#parallax-bg1');
      $('<img>').attr('src',posts[i].image).css('position','absolute').css('top',125+(i%2)*150).css('left',i*1360+1220).appendTo('#parallax-bg3');
      postsToAdd.push(createNewRow(posts[i],i));
    }
    blogContainer.append(postsToAdd);
    $('body').height(posts.length * 1500);
  }

  // This function constructs a post's HTML
  function createNewRow(post,i) {
    // var formattedDate = new Date(post.createdAt);
    // formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newPostCard = $("<div>");
    newPostCard.addClass("card").css('left',1400*i).css('top',-120*i +(i%2)*150);;
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");;
    // var deleteBtn = $("<button>");
    // deleteBtn.text("x");
    // deleteBtn.addClass("delete btn btn-danger");
    // var editBtn = $("<button>");
    var likeBtn  = $("<button>");
    // likeBtn.html('<i class="fas fa-thumbs-up"></i>');
    likeBtn.addClass('btn btn-outline-success fas fa-thumbs-up');
    var dislikeBtn  = $("<button>");
    dislikeBtn.addClass('btn btn-outline-danger fas fa-thumbs-down');
    var scoreBtn  = $("<button>");
    scoreBtn.addClass('btn btn-sm btn-outline-dark').text('0');
    var meTooBtn = $('<button>');
    meTooBtn.addClass('btn btn-sm btn-outline-light ml-3').text('Me Too');

    // editBtn.text("EDIT");
    // editBtn.addClass("edit btn btn-info");
    var newPostTitle = $("<h2>").css('color','red').css('font-size', "8vmin");
    var newPostDate = $("<small>");
    // var newPostAuthor = $("<h5>");
    // newPostAuthor.text("Written by: " + post.Author.name);
    // newPostAuthor.css({
    //   float: "right",
    //   color: "blue",
    //   "margin-top":
    //   "-10px"
    // });
console.log(posts[i].image);

    var newPostCardBody = $("<article>");
    newPostCardBody.addClass("card-body shpost");//.css('left',1400*i).css('top',-24*i);
    var newPostBody = $("<p>");
    newPostTitle.text(post.title + " ");
    newPostBody.text(post.body);
    // newPostDate.text(formattedDate);
    // newPostTitle.append(newPostDate);
    // newPostCardHeading.append(deleteBtn);
    // newPostCardHeading.append(editBtn);
    newPostCardHeading.append(newPostTitle);
    newPostTitle.append(likeBtn);
    newPostTitle.append(scoreBtn);
    newPostTitle.append(dislikeBtn);
    newPostTitle.append(meTooBtn);
    

    // newPostCardHeading.append(newPostAuthor);
    newPostCardBody.append(newPostBody);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.data("post", post);
    return newPostCard;
  }

  // This function figures out which post we want to delete and then calls deletePost
  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id);
  }

  // This function figures out which post we want to edit and takes it to the appropriate url
  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/cms?post_id=" + currentPost.id;
  }

  // This function displays a message when there are no posts
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Author #" + id;
    }
    blogContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No posts yet" + partial + ", navigate <a href='/cms" + query +
    "'>here</a> in order to get started.");
    blogContainer.append(messageH2);
  }

});
