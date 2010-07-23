/**
 * @author julian
 */
if(!window.WebSocket){
	$('head').prepend("<script type='text/javascript' src='js/swfobject.js'></script><script type='text/javascript' src='js/FABridge.js'></script><script type='text/javascript' src='js/web_socket.js'></script>");
}
var Notifier=function(){
	var hasFocus=true;
	var checkNotify=function(){
		if(window.webkitNotifications){
			return true;		
		}
		else{
			return false;
		}
	};
	$(window).blur(function(){hasFocus=false;});
	$(window).focus(function(){hasFocus=true;});
	return{
		notify:function(icon,title,message){
			if(checkNotify()&& !hasFocus){
				if (window.webkitNotifications.checkPermission() == 0) {
					window.webkitNotifications.createNotification(icon, title, message).show();
				}
			}
		},
		requestPermission:function(){
			if(checkNotify()){
				window.webkitNotifications.requestPermission();
			}
		}
	}
};
var notifier=new Notifier();
var chat=function(ws){
	//constants
	var LOGIN=1;
	var JOINROOM=2;
	var MESSAGE=3;
	var LOGOUT=4;
	var NEWROOM=5;
	var LEAVEROOM=6;
	//variable for websocket
	var ws=ws;
	//user instance variable
	var user;
	var chatManager;
	var tabs;
	ws.onmessage = function(e) {
	   var jsonObject=$.parseJSON(e.data);
	   var result=jsonObject.RESULT;
	   var message=jsonObject.MESSAGE;
	   console.log(result);
	   console.log(jsonObject);
	   console.log(e.data);
	   switch(result){
		   case "loginSuccessful":
			for (room in message.ROOMS) {
				$("#rooms .tab-content").append("<div class='chat-room-link ui-state-default ui-corner-top'>"+message.ROOMS[room].ROOMNAME+"</div>");
			}
			for (theUser in message.USERS){
				$("#users .tab-content").append("<div class='user-link ui-state-default ui-corner-top "+message.USERS[theUser].USERNAME.replace(" ","-")+"'>"+message.USERS[theUser].USERNAME+"</div>")
			}
			$(".chat-room-link").hover(function(){$(this).addClass("ui-state-hover");},function(){$(this).removeClass("ui-state-hover");})
			$(".chat-room-link").click(chatRoomLinkClick);
			break;
		   case "joinSuccessful":
		    var tabId=message.NAME.replace(" ","-");
			if ($("#room-" + tabId).length == 0) {
				$("#chat-box").tabs("add", "#room-" + tabId, message.NAME + '<span class="ui-icon ui-icon-close"></span>');
				$("#chat-box").tabs("select","#room-" + tabId);
				$(".ui-icon-close").click(leaveRoom);
				$("#room-" + tabId).append("<div class='tab-content'><div class='room-chat-box'></div><div class='room-user-box'></div></div><div><input type='text' class='txtMessage' id='txtMessage-" + tabId + "' name='txtMessage'><input id='send-" + tabId + "' type='button' value='Send'/></div>");
				for (theUser in message.USERS) {
					$("#room-" + tabId + " .room-user-box").append("<div class='user-link ui-state-default ui-corner-top " + message.USERS[theUser].USERNAME.replace(" ", "-") + "'>" + message.USERS[theUser].USERNAME + "</div>");
				}
				$("#room-" + tabId).data("roomName", message.NAME);
				$("#send-" + tabId).data("roomName", message.NAME);
				$("#send-" + tabId).click(sendChatRoomMessage);
				$("#txtMessage-" + tabId).keydown(function(event){
					if (event.keyCode == 13) {
						$("#send-" + tabId).click();
					}
				});
			}
			break;
		   case "roomMessage":
		   notifier.notify("","New Message in "+jsonObject.roomName,jsonObject.userName+": "+jsonObject.message);
		   	addRoomMessage(jsonObject.roomName,jsonObject.userName,jsonObject.message);
		   	break;
		   case "userJoined":
		   	addUser(jsonObject.USERNAME,jsonObject.ROOMNAME);
			break;
		   case "newRoom":
		   	$("#rooms .tab-content").append("<div class='chat-room-link ui-state-default ui-corner-top'>"+jsonObject.ROOMNAME+"</div>");
			$(".chat-room-link").click(chatRoomLinkClick);
			break;
		   case "userLeft":
		   	$("."+jsonObject.USERNAME.replace(" ","-")).remove();
	   }
    }
	var leaveRoom=function(){
		chatManager.leaveRoom(user.getName(),$(this).parent().parent().data("roomName"));
		$("#chat-box").tabs("remove",$("li",tabs).index($(this).parent().parent()));
	};
	var sendChatRoomMessage=function(){
		var roomName=$(this).data("roomName");
		var replacedRoomname=roomName.replace(" ","-");
		var message=$("#txtMessage-"+replacedRoomname).val();
		chatManager.sendRoomMessage(message,roomName,user.getName());
		addRoomMessage(replacedRoomname,user.getName(),message);
		var message=$("#txtMessage-"+replacedRoomname).val("");
	};
	var chatRoomLinkClick=function(){
		if ($("#room-" + $(this).text().replace(" ","-")).length == 0) {
			chatManager.joinRoom($(this).text(), user.getName());
		}
	};
	var addRoomMessage=function(roomName,userName,message){
		var roomName=roomName.replace(" ","-");
		$("#room-"+roomName+" .room-chat-box").append("<div class='message-box'><span class='message-user-name'>"+userName+":&nbsp;</span><span class='message'>"+message+"</span><div>");
		$("#room-"+roomName+" .room-chat-box").get(0).scrollTop+=5000;
	};
	var addUser=function(userName,roomName){
		var message="<div class='userJoined'>***" + userName + "***";
		if (roomName) {
			message+=" has joined "+roomName+" room.</div>";
			roomName=roomName.replace(" ","-");
			$("#room-"+roomName+" .room-chat-box").append(message);
			$("#room-"+roomName+" .room-user-box").append("<div class='user-link ui-state-default ui-corner-top "+userName.replace(" ","-")+"'>"+userName+"</div>");
		}
		else {
			message+=" has joined chat.</div>";
			$("#console .tab-content").append(message);
			$("#users .tab-content").append("<div class='user-link ui-state-default ui-corner-top "+userName.replace(" ","-")+"'>"+userName+"</div>")
		}	
	};
	var addRoom=function(){
		var roomName=$("#txtAddRoom").val();
		$("#txtAddRoom").val("");
		if (roomName != "") {
			chatManager.addRoom(roomName);
		}
		$("#rooms .tab-content").append("<div class='chat-room-link ui-state-default ui-corner-top'>"+roomName+"</div>");
		$(".chat-room-link").click(chatRoomLinkClick);
	};
	//user object
	var User=function(ws){
		var loggedIn=false;
		var userName;
	};
	User.prototype.setName=function(name){
		userName=name;
	};
	User.prototype.getName=function(){
		return userName;
	};
	User.prototype.setLoggedIn=function(value){
		loggedIn=value;
	};
	User.prototype.IsLoggedIn=function(){
		return loggedIn;
	};
	User.prototype.login=function(){
		console.log(userName);
		ws.send('{"type":'+LOGIN+',"userName":"'+userName+'"}');
	};
	var ChatRoom=function(){
		var roomName;
		var users=new Array();
	}
	ChatRoom.prototype.setRoomName=function(name){
		roomName=name;
	};
	ChatRoom.prototype.getRoomName=function(){
		return userName;
	};
	ChatRoom.prototype.addUser=function(user){
		users.add(user)
	};
	ChatRoom.prototype.removeUser=function(user){
		//implement
	};
	user=new User(ws);
	//manager
	var ChatRoomManager=function(){
		var users=new Array();
		var chatRooms=new Array();
	};
	ChatRoomManager.prototype.joinRoom=function(chatRoom,user){
		ws.send('{"type":'+JOINROOM+',"userName":"'+user+'","roomName":"'+chatRoom+'"}');
	};
	ChatRoomManager.prototype.sendRoomMessage=function(message,chatRoom,user){
		ws.send('{"type":'+MESSAGE+',"message":"'+message+'","userName":"'+user+'","roomName":"'+chatRoom+'"}');
	};
	ChatRoomManager.prototype.addRoom=function(roomName){
		ws.send('{"type":'+NEWROOM+',"roomName":"'+roomName+'"}');
	};
	ChatRoomManager.prototype.leaveRoom=function(userName,roomName){
		console.log("leaving");
		ws.send('{"type":'+LEAVEROOM+',"userName":"'+user+'","roomName":"'+roomName+'"}');
	};
	//chatmanager instance variable
	chatManager=new ChatRoomManager();
	function login(){
		user.setName($("#txtUserName").val());
		user.login();
		notifier.requestPermission();
		$("#login-box").dialog("close");
		$("#btnAddRoom").click(addRoom);
	}
	return {
		showLogin: function(){
			tabs=$(".tabs").tabs();
			$("#login-box").dialog({
				modal: true
			});
			$("#btnLogin").click(login);
		}
	}
};
$(document).ready(function(){
	var theWebSocket=new WebSocket("ws://chat.juliangautier.com:843");
	var theChat = new chat(theWebSocket);
	theChat.showLogin();
});
