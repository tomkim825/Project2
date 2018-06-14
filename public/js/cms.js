$(document).ready(function() {
  // Getting jQuery references to the post body, title, form, and author select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var tagInput = $("#tags");
  var imageInput = $("#image");
  var cmsForm = $("#cms");
  var authorSelect = $("#author");
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
  var url = window.location.search;
  var postId;
  var authorId;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the post id from the url
  // In '?post_id=1', postId is 1
  if (url.indexOf("?post_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData(postId, "post");
  }
  // Otherwise if we have an author_id in our url, preset the author select box to be our Author
  else if (url.indexOf("?author_id=") !== -1) {
    authorId = url.split("=")[1];
  }

  // Getting the authors, and their posts
  getAuthors();

  // A function for handling what happens when the form to create a new post is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body, title, or author
    if (!titleInput.val().trim() || !bodyInput.val().trim() || !authorSelect.val()) {
      return;
    }
    // Constructing a newPost object to hand to the database
    var newPost = {
      title: titleInput
        .val()
        .trim(),
      body: bodyInput
        .val()
        .trim(),
        image: imageInput
        .val()
        .trim(),
        tags: tagInput
        .val()
        .trim(),
      AuthorId: "author"
    };

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newPost.id = postId;
      updatePost(newPost);
    }
    else {
      submitPost(newPost);
    }
  }

  // Submits a new post and brings user to blog page upon completion
  function submitPost(post) {
    $.post("/api/posts", post, function() {
      window.location.href = "/blog";
    });
  }

  // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
  function getPostData(id, type) {
    var queryUrl;
    switch (type) {
    case "post":
      queryUrl = "/api/posts/" + id;
      break;
    case "author":
      queryUrl = "/api/authors/" + id;
      break;
    default:
      return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.AuthorId || data.id);
        // If this post exists, prefill our cms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        authorId = data.AuthorId || data.id;
        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Authors and then render our list of Authors
  function getAuthors() {
    $.get("/api/authors", renderAuthorList);
  }
  // Function to either render a list of authors, or if there are none, direct the user to the page
  // to create an author first
  function renderAuthorList(data) {
    if (!data.length) {
      window.location.href = "/authors";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createAuthorRow(data[i]));
    }
    authorSelect.empty();
    // console.log(rowsToAdd);
    // console.log(authorSelect);
    authorSelect.append(rowsToAdd);
    authorSelect.val(authorId);
  }

  // Creates the author options in the dropdown
  function createAuthorRow(author) {
    var listOption = $("<option>");
    listOption.attr("value", author.id);
    listOption.text(author.name);
    return listOption;
  }

  // Update a given post, bring user to the blog page when done
  function updatePost(post) {
    $.ajax({
      method: "PUT",
      url: "/api/posts",
      data: post
    })
      .then(function() {
        window.location.href = "/blog";
      });
  }

// get tags
var tagsArray = [];
$.get("/api/posts", function(data) {
  posts = data;
 for (var i=0; i<posts.length; i++) {
  var splitTags = posts[i].tags.split(' ')
  for (var j=0; j<splitTags.length; j++){
    if (tagsArray.indexOf(splitTags[j]) === -1){
      tagsArray.push(splitTags[j])
    } } } }).then( function(){
for (var i=0; i<tagsArray.length && i<30; i++){
  $('<button>').attr('id',tagsArray[i]).addClass('btn btn-outline-light tagButton').text('#'+tagsArray[i]).appendTo('#addTag');
}})

$(document).on('click', '.tagButton', function () {
    $('#tags').val($('#tags').val() + " " +this.id);
    $(this).css('display','none' )
});

// adding firebase storage
 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBKX1GXX2C_DBhXESSB3xtln6W8czM-TJY",
    authDomain: "project1-marvelfaceapi.firebaseapp.com",
    databaseURL: "https://project1-marvelfaceapi.firebaseio.com",
    projectId: "project1-marvelfaceapi",
    storageBucket: "project1-marvelfaceapi.appspot.com",
    messagingSenderId: "259704712712"
  };
  firebase.initializeApp(config);
  var storage = firebase.storage();

  // ***************************************************************
//          Input option #2: user selects file from device
//    file sent to FireBase storage & URL returned -> callAPIs()  
// ***************************************************************
$(document).on("click", '#upload', function(event) {
  event.preventDefault();
  var filename = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');
  
  // upload if file selected
  if( $('#userImageFile').val() !== ''){
      $('#uploadStatus').css('color','red').text('UPLOADING...');
      setTimeout(function(){$('#uploadStatus').css('color','red').text('Slow connection...could take a few moments'); },1000*25) 
      const file = $('#userImageFile').get(0).files[0];
      const task = storage.ref().child(filename).put(file);
      task.then(function(snapshot) {
        $('#uploadStatus').css('color','blue').text('Done! URL filled in on the right');
      $('#image').val(snapshot.downloadURL);
      $('#userImageFile').val(''); 
      });
  } else {
      $('<div>').addClass('alert alert-warning').html('<strong>MISSING!</strong> Please enter info').attr('id','message-'+messageCount).appendTo('#resultDiv');
  }; 
});



}); //end of doc ready

