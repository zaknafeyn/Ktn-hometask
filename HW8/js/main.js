$(document).ready(function(){
	// $("#signup").hide();
	// $("#list").hide();
	// $("#show-full").hide();

	// set events for nav bar
	$("#signup-nav").click(signUpClick);
	$("#login-nav").click(logInClick);
	$("#list-nav").click(listClick);

	$("#logout-nav").click(logoutClick)

	// set default nav-bar state
	togleSections("login");

	// set events for buttons
	// login form
	$("#login a").click(signUpClick);
	$('#login input[type="button"]').click(login);

	$("#login input[type='text'], #login input[type='password']").keypress(function(e){
		if(e.keyCode == 13)
			$("#login input[type='button']").click();
	});

	// signup form
	$("#signup a").click(logInClick);
	$('#signup input[type="button"]').click(signup);

	$("#signup input[type='text'], #signup input[type='password']").keypress(function(e){
		if(e.keyCode == 13)
			$("#signup input[type='button']").click();
	});

	$(document).on('click','#list a.url', onClickUserPanel)

	// $("#list a.url").on("click", onClickUserPanel);
});

function signUpClick (e){
	togleSections("signup");
	$("#signup input[name='login']").focus();
}

function logInClick(e){
	togleSections("login");
	$("#login input[name='login']").focus();
}

function listClick(e){
	togleSections("list");
}

function logoutClick(e){
	proceedLogout();
}

function togleSections(sectionToShow){

	cleanupSectionInputs(sectionToShow);
	removeAllErrors(sectionToShow);

	var sections = ["login", "list", "signup"];
	var len = sections.length;
	for(var i = 0; i < len; i++)
	{
		var id = "#" + sections[i];
		var navId = id + "-nav";
		if (sections[i] == sectionToShow)
		{
			$(id).show();
			$(navId).addClass("active")
		}
		else
		{
			$(id).hide();
			$(navId).removeClass("active");
		}
	}
}


function cleanupSectionInputs(section) {
	$("#" + section + " input[type='text']").val("");
	$("#" + section + " input[type='password']").val("");
}

function proceedLogin(userName, token) {
	// show greetings
	togleSections("list");

	window.config = {
		token : token
	};

	$("#user-info>*").removeClass("hidden").addClass("loggedin");
	$("#user-greeting-nav a").text("Logged in as " + userName);
	$("#login-nav").hide();
	$("#signup-nav").hide();

	// show list of users
	$.ajax({
			url: "http://api.sudodoki.name:8888/users", 
			type: "GET",
			error: function(xhr, status) {
				alert("error: " + status);
			},
			success:function(data){
				$("#list ul *").remove();

				var len = data.length;
				for(var i=0; i<len; i++){
					// console.log(data[i] + " : " + createItem(data[i]));
					$("#list ul").append(createItem(data[i]));
				};

				getUserDetails(getCurrentToken(), data[0].id);

			},
			beforeSend: function() {
				$('#loading').show();
			},
			complete: function() {
				$('#loading').hide();
			},
		});
}

function getCurrentToken() {
	return window.config.token;
}

function proceedLogout(userName) {
	togleSections("login");

	// reset token
	window.config = {
		token : ''
	};

	$("#user-info>*").removeClass("loggedin").addClass("hidden");
	$("#login-nav").show();
	$("#signup-nav").show();
}