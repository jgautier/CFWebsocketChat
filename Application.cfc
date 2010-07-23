component 
{
	this.name="CFWebsocket";
	boolean function OnApplicationStart()
	{
		application.chatmanager=new ChatManager();
		local.chatRoom=new ChatRoom("Default");
		application.chatmanager.addRoom(user=-1,room=local.chatRoom);
		return true;
	}
}