$(document).ready(function() {
var blogContainer = $(".front");  // blogContainer holds all of our posts
var postCategorySelect = $("#category");
var posts;   // Variable to hold our posts
var postsArray = [];
//***********************************************************
// **     Above reserved for initializing global variables     **
//**********************************************************
//========================================
// --      [start] Button Clicks: like/dislike/ohyeah/search
//========================================
  // If user clicks "like"
// -------------------------------------------------------------------
  $(document).on("click", "button.like",  function () {
    if ($(this).hasClass('notClicked')) { // only allow if button hasn't already been clicked
    for (var i =0 ; i<postsArray.length; i++) {  //cycle through array of posts to find corresponding one to button
      if ($.parseJSON($(this).attr('data-id')) == postsArray[i].id ) { //when the parsed ID from button is equal to the post ID, stop the for loop 
        postsArray[i].likes ++; //add one to the likes value
        $(this).text(' '+ postsArray[i].likes).addClass('bg-dark'); //update the text on the button and make the button grayed-out
        $(this).removeClass('notClicked'); //this will now not pass the initial condition above. User cannot like again.
          $.ajax({ //next send an AJAX call to update the database
            method: "PUT", //put method for updates
            url: "/api/posts", 
            data: postsArray[i] //we are sending the upated post with incremented likes
          }).then( function() { } );  
      } }; } } ) // collapsing all closing brackets into 1 line of code for brevity.

 // If user clicks "dislike"
// -------------------------------------------------------------------
$(document).on("click",  "button.dislike",  function () {
  if ($(this).hasClass('notClicked')) { // only allow if button hasn't already been clicked
    for (var i =0 ; i<postsArray.length; i++) {  //cycle through array of posts to find corresponding one to button
    if ($.parseJSON($(this).attr('data-id')) == postsArray[i].id ) { //when the parsed ID from button is equal to the post ID, stop the for loop 
      postsArray[i].dislikes ++; //add one to the dislikes value
      $(this).text(' '+ postsArray[i].dislikes).addClass('bg-dark'); //update the text on the button and make the button grayed-out
      $(this).removeClass('notClicked'); //this will now not pass the initial condition above. User cannot dislike again.
        $.ajax({ //next send an AJAX call to update the database
          method: "PUT", //put method for updates
          url: "/api/posts", 
          data: postsArray[i] //we are sending the upated post with incremented dislikes
        }).then( function() { } );  
    } }; } } ) // collapsing all closing brackets into 1 line of code for brevity.

// If user clicks "oh yeah"
// -------------------------------------------------------------------
$(document).on("click",  "button.ohyeah",  function () {
  if ($(this).hasClass('notClicked')) { // only allow if button hasn't already been clicked
    for (var i =0 ; i<postsArray.length; i++) {  //cycle through array of posts to find corresponding one to button
    if ($.parseJSON($(this).attr('data-id')) == postsArray[i].id ) { //when the parsed ID from button is equal to the post ID, stop the for loop 
      postsArray[i].ohyeah ++; //add one to the ohyeah value
      $(this).text(' '+ postsArray[i].ohyeah).addClass('bg-dark'); //update the text on the button and make the button grayed-out
      $(this).removeClass('notClicked'); //this will now not pass the initial condition above. User cannot click oh yeah again.
        $.ajax({ //next send an AJAX call to update the database
          method: "PUT", //put method for updates
          url: "/api/posts", 
          data: postsArray[i] //we are sending the upated post with incremented dislikes
        }).then( function() {  } );  //this will now not pass the initial condition above. User cannot ohYeah again.
    } }; } } ) // collapsing all closing brackets into 1 line of code for brevity.
   
// If user clicks "search"
// -------------------------------------------------------------------
$(document).on("click", "button.search", searchPosts );
function searchPosts(event) {
  event.preventDefault();
  var query = $('#search').val().trim(); //get input fields

  $.get("/api/search/" + query, function(data) { //AJAX get method
    posts = data;
    if (!posts || !posts.length) { blogContainer.empty().text('no results found') } //if there is no data or results is 0, display 'no results found'
    else { initializeRows() } //OTHERWISE generate results
}); } // collapsing all closing brackets into 1 line of code for brevity.

//========================================
// --      [end] Button Clicks: like/dislike/ohyeah/search
//========================================

//========================================
// --      [start] Code for which posts to display
//========================================
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
      posts = data;
      if (!posts || !posts.length) {
        displayEmpty(author);
      }
      else { initializeRows(); }
    });
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
  
//========================================
// --      [end] Code for which posts to display
//========================================  

//========================================
// --      [start] InitializeRows() - appends all of our constructed post HTML inside blogContainer
//========================================  
  function initializeRows() {
    blogContainer.empty(); //empties all post from the page. For example to display search results
    var postsToAdd = [] // init array to hold posts
   for (var i = 0; i < posts.length; i++) { 
      postsToAdd.push(createNewRow(posts[i],i)); //fill array with created divs with content
    };
    blogContainer.append(postsToAdd); //add newly created posts to container to display in HTML
    $('body').height(posts.length * 100 + 'vw'); //resize HTML body height. Every post adds 100% of the (screen) Viewport Width to the height. In this app, the height needs to match the width to give enough scrolling space.  
    $('<div>').css('border','1px solid white').css('width', posts.length * 100+'vw').css('position','fixed').css('top','49%').css('left',0).appendTo('.blog'); //upper white center bar at 49% from the top
    $('<div>').css('border','1px solid white').css('width', posts.length * 100+'vw').css('position','fixed').css('top','51%').css('left',0).appendTo('.blog'); //lower white center bar at 51% from the top
  }

  // helper function to constructs a post's HTML. Called in for loop above for each post
  function createNewRow(post,i) {
    postsArray.push(post); //pushes post info into array to be used to reference. Button click has data-ID. For loop of postArray to find matching ID to get post info to update
    var newPostCard = $("<div>").addClass('page').css('left',95*i +10+'vw').css('top',-50*i +"vh").css('max-width','75vh').css('height','auto'); //main card. added viewport width positioning to ensure it works correctly
    var newPostCardInfo = $("<img>").attr('src', post.image).css('max-width','75vh').css('height','auto').appendTo(newPostCard); 
    var newTitle = $('<h3>').text(post.title).appendTo(newPostCard);
    var newBody = $('<p>').text(post.body).appendTo(newPostCard);
    var likeBtn  = $("<button>").attr('id', 'like').addClass('like notClicked btn btn-outline-dark fas fa-thumbs-up').attr('data-id',post.id).text(" "+post.likes).appendTo(newPostCard);
    var dislikeBtn  = $("<button>").attr('id', 'dislike').addClass('dislike notClicked btn btn-outline-dark fas fa-thumbs-down').attr('data-id',post.id).text(" "+post.dislikes).appendTo(newPostCard);
    var ohYeahBtn = $('<button>').attr('id', 'oyea').addClass('ohyeah notClicked btn btn-outline-dark btn btn-outline-danger fa fa-users').attr('data-id',post.id).text(" "+post.ohyeah).appendTo(newPostCard);
    newPostCard.appendTo('.front');
    return newPostCard;
  }
//========================================
// --      [end] InitializeRows() - appends all of our constructed post HTML inside blogContainer
//========================================  
}); //end of document ready
