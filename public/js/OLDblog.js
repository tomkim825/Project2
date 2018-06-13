$(document).ready(function() {
  /* global moment */

  // blogContainer holds all of our posts
  var blogContainer = $(".blog-container");
  var postCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
  $(document).on("click", "button.like",  handlePostLike);
  $(document).on("click", "button.dislike", handlePostDislike);
  $(document).on("click", "button.ohyeah",  handlePostOhYeah);
  $(document).on("click", "button.search", handlePostSearch );
  // Variable to hold our posts
  var posts;

  var postsArray = [];

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
  function handlePostSearch(event) {
    event.preventDefault();
    var query = $('#search').val().trim();
    searchTerm = "/?search=" + query;
  console.log(query)
    $.get("/api/search/" + query, function(data) {
      console.log("Posts", data);
      posts = data;
      if (!posts || !posts.length) {
        blogContainer.empty();
        blogContainer.text('no results found');
      }
      else {
        initializeRows();
      }
    });
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

    // This function does an API call to like posts
    function likePost(post) {
      post.likes += 1
      console.log(post);
      $.ajax({
        method: "PUT",
        url: "/api/posts",
        data: post
      })
        .then(function() {
          window.location.href = "/blog";
        });
    }

    function ohYeahPost(post) {
      post.ohyeah += 1

      $.ajax({
        method: "PUT",
        url: "/api/posts",
        data: post
      })
        .then(function() {
          window.location.href = "/blog";
        });
    }


    // This function does an API call to like posts
    function dislikePost(post) {

      post.likes -= 1
   
      $.ajax({
        method: "PUT",
        url: "/api/posts",
        data: post
      })
        .then(function() {
          window.location.href = "/blog";
        });
    }



  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    var postsToAdd = []
    var images = ['http://www.midwest-vintage.com/blog/wp-content/uploads/2012/02/4132732432_c7e8f230fd_b.jpg',"https://1.bp.blogspot.com/-S8oaWWs42mk/Wxa_Me-g0LI/AAAAAAADKXM/VvGKpABSO38nYJsrYHxcnoiR1aG6WGFlwCLcBGAs/s1600/keith-parfitt-photos-3.jpg","http://quartersnacks.com/wp-content/uploads/2011/02/022111.jpg", "http://ultimateclassicrock.com/files/2015/03/Jimi-Hendrix.jpg", "https://flashbak.com/wp-content/uploads/2015/03/japanese-advertising-19.jpg", "https://d2jv9003bew7ag.cloudfront.net/uploads/Musa-N.Nxumalo-Sihle-Khambule-1-%E2%80%93-Alternative-Kidz-series-2009-courtesy-of-the-artist-and-SMAC-gallery..jpg"];
    for (var i = 0; i < posts.length; i++) {
      var randomNumber =  Math.floor(Math.random()*images.length);
      var randomNumber2 =  Math.floor(Math.random()*images.length);
      var randomHeight = Math.floor(Math.random()*15);
      var randomHeight2 = Math.floor(25+Math.random()*25);
      $('<img>').attr('src',images[randomNumber]).css('filter', 'blur(3px) grayscale()').css('opacity', '0.25').css('transform', 'scale(0.45)').css('position','absolute').css('top', randomHeight+"vh").css('left',i*1120+200).appendTo('#parallax-bg2');
      $('<img>').attr('src',images[randomNumber2]).css('filter', 'blur(8px) grayscale()').css('opacity', '0.1').css('transform', 'scale(0.2)').css('position','absolute').css('top', randomHeight2+"vh").css('left',i*1310+150).appendTo('#parallax-bg1');
      $('<img>').attr('src',posts[i].image).css('position','absolute').css('top',125+(i%2)*150).css('left',i*1360+1220).appendTo('#parallax-bg3');
      postsToAdd.push(createNewRow(posts[i],i));
    }
    blogContainer.append(postsToAdd);
    $('body').height(posts.length * 1500);
    $('<div>').css('border','1px solid white').css('width', posts.length * 1500).css('position','fixed').css('top','49%').css('left',0).appendTo('.blog');
    $('<div>').css('border','1px solid white').css('width', posts.length * 1500).css('position','fixed').css('top','51%').css('left',0).appendTo('.blog');
  }

  // This function constructs a post's HTML
  function createNewRow(post,i) {
    postsArray.push(post);
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
    likeBtn.addClass('like btn btn-outline-success fas fa-thumbs-up').attr('id',post.id);
    var dislikeBtn  = $("<button>");
    dislikeBtn.addClass('dislike btn btn-outline-danger fas fa-thumbs-down').attr('id',post.id);;
    var scoreBtn  = $("<button>");
    scoreBtn.addClass('score btn btn-sm btn-outline-dark').text(post.likes);
    var ohYeahBtn = $('<button>');
    ohYeahBtn.addClass('ohyeah btn btn-sm btn-outline-light ml-3').text('Oh Yeah: ' + post.ohyeah).attr('id',post.id);;

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
    newPostTitle.append(ohYeahBtn);
    

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

  function handlePostLike() {
    var postNew;
    for (var i =0 ; i<postsArray.length; i++) {
      if (parseInt($(this)[0].id) == postsArray[i].id){
        postNew = postsArray[i]
      }
    };
    likePost(postNew);
  }

  function handlePostDislike() {
    var dislikedPost;
    for (var i =0 ; i<postsArray.length; i++) {
      if (parseInt($(this)[0].id) == postsArray[i].id){
        dislikedPost = postsArray[i]
      }
    };
    dislikePost(dislikedPost);
  }

  function handlePostOhYeah() {
    var ohYeah;
    for (var i =0 ; i<postsArray.length; i++) {
      if (parseInt($(this)[0].id) == postsArray[i].id){
        ohYeah = postsArray[i]
      }
    };
    ohYeahPost(ohYeah);
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
