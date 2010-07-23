component  output="false"
{
	LOGIN=1;
	public void function onClientClose(cfevent)
	{
		application.chatmanager.removeUser(cfEvent.connection);
	}
	public void function onClientMessage(cfevent)
	{
		local.messageStruct=deserializeJSON(cfEvent.message);
		switch(messageStruct.type){
			case 1:{
				local.user=new User(cfEvent.connection,messageStruct.userName);
				application.chatManager.addUser(user);
				local.returnStruct={};
				local.returnStruct.result="loginSuccessful";
				local.returnStruct.message=application.chatManager.toStruct();
				cfEvent.connection.send(serializeJSON(local.returnStruct));
				break;
			}		
			case 2:{
				local.room=application.chatManager.joinRoom(cfEvent.connection.toString(),local.messageStruct.roomName);
				local.returnStruct={};
				local.returnStruct.result="joinSuccessful";
				local.returnStruct.message=local.room.toStruct();
				cfEvent.connection.send(serializeJSON(local.returnStruct));
				break;
			}		
			case 3:{
				local.messageStruct.result="roomMessage";
				application.chatManager.sendRoomMessage(cfEvent.connection.toString(),local.messageStruct.roomName,serializeJSON(local.messageStruct));
				break;
			}
			case 5:{
				local.room=new ChatRoom(local.messageStruct.roomName);
				application.chatmanager.addRoom(user=cfEvent.connection.toString(),room=local.room);
				break;
			}
			case 6: {
				application.chatmanager.leaveRoom(cfEvent.connection,local.messageStruct.roomName);
				
			}
		}
	}
	public void function onClientOpen(cfevent)
	{
		var blah=structnew();
	}
}