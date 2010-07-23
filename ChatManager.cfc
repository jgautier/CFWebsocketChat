component  output="false"
{
	variables.instance={};
	variables.instance.rooms=structNew();
	variables.instance.users=structNew();
	void function init()
	{
	}
	any function getUsers()
	{
		return variables.instance.users;
	}
	void function addUser(User user)
	{
		notifyUsers(arguments.user.getConnection().toString(),{result="userJoined",roomName="",userName=user.getUserName()});
		variables.instance.users[arguments.user.getConnection().toString()]=arguments.user;
	}
	void function removeUser(connection)
	{
		if(structKeyExists(variables.instance.users,arguments.connection.toString())){
			var user=variables.instance.users[arguments.connection.toString()];
			for(room in variables.instance.rooms){
				variables.instance.rooms[room].removeUser(arguments.connection);
			}
			StructDelete(variables.instance.users,arguments.connection.toString());
			notifyUsers("",{result="userLeft",username=user.getUserName()});
		}	
	}
	void function addRoom(user,ChatRoom room)
	{
		variables.instance.rooms[room.getName()]=arguments.room;
		notifyUsers(user,{result="newRoom",roomName=room.getName()});
	}
	ChatRoom function joinRoom(string connection,string roomName)
	{
		if(StructKeyExists(variables.instance.rooms,arguments.roomName) && structKeyExists(variables.instance.users,arguments.connection))
		{
			local.room=variables.instance.rooms[arguments.roomName];
			local.user=variables.instance.users[arguments.connection];
			local.room.addUser(user);
			return local.room;
		}
	}
	void function leaveRoom(string connection,string roomName)
	{
		if(StructKeyExists(variables.instance.rooms,arguments.roomName) && structKeyExists(variables.instance.users,arguments.connection))
		{
			local.room=variables.instance.rooms[arguments.roomName];
			local.room.removeUser(arguments.connection);
			notifyUsers(connection,{result="userLeft",username=user.getUserName(),roomName=arguments.roomname});
		}
	}
	void function sendRoomMessage(string userName,string roomName,string message)
	{
		if(StructKeyExists(variables.instance.rooms,arguments.roomName))
		{
			local.room=variables.instance.rooms[arguments.roomName];
			//todo makes sure user is a member of the chat room
			local.room.sendMessage(arguments.userName,arguments.message);
		}
	}
	void function sendUserMessage(string fromUserName,string toUserName)
	{
	
	}
	private void function notifyUsers(user,message){
		for(theUser in variables.instance.users)
		{
			if(theUser !=user){
				variables.instance.users[theUser].sendMessage(serializeJSON(message));
			}	
		}		
	}
	struct function toStruct()
	{
		local.chatManagerStruct={};
		local.chatManagerStruct.users=arrayNew(1);
		for(user in variables.instance.users)
		{		
			ArrayAppend(local.chatManagerStruct.users,{userName=variables.instance.users[user].getUserName()});
		}
		local.chatManagerStruct.rooms=arrayNew(1);
		for(room in variables.instance.rooms)
		{
			ArrayAppend(local.chatManagerStruct.rooms,{roomName=variables.instance.rooms[room].getName()});
		}
		return local.chatManagerStruct;
	}
	
}