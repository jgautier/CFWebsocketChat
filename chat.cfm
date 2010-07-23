<!DOCTYPE html>
<html>
  <head>
    <title>WebSocket Chat Client</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link type="text/css" href="css/ui-lightness/jquery-ui-1.8.1.custom.css" rel="stylesheet" />
	<link type="text/css" href="css/chat.css" rel="stylesheet" />	
	<script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
	<script type="text/javascript" src="js/jquery-ui-1.8.1.custom.min.js"></script>
	<script type="text/javascript" src="js/chat.js"></script>
  </head>
  <body>
      <div id="login-box" title="Sign In">
      	<label for="txtUserName">User Name:</label><input type="text" name="txtUserName" id="txtUserName"><br>
		<input type="button" name="btnLogin" id="btnLogin" value="Sign In"/>
      </div>
	  <div id="users-rooms-box" class="tabs">
		  <ul>
		  	<li><a href="#rooms">Rooms</a></li>
			<li><a href="#users">Users</a></li>
		  </ul>
		  <div id="rooms">
		  	<div class="tab-content">
			</div>
			<div id="rooms-filter">
				<input type="text" name="txtAddRoom" id="txtAddRoom" class="filter-input"/>
				<input type="button" id="btnAddRoom" name="btnAddRoom" value="Add Room"/>
			</div>
		  </div>
		  <div id="users">
		  	<div class="tab-content">
			</div>
			<div id="users-filter">
				<input type="text" name="txtFilterUsers" class="filter-input"/>
			</div>
		  </div>
	  </div>
	  <div id="chat-box" class="tabs">
		  <ul>
		  	<li><a href="#console">Console</a></li>
		  </ul>
		  <div id="console">
			<div class="tab-content">
			</div>
		  </div>
	  </div>
  </body>
</html>
