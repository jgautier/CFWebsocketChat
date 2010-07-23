component  output="false"
{
	variables.instance.name="";
	variables.instance.users={};
	public void function init(string name)
	{
		variables.instance.name=arguments.name;
	}
	void function addUser(User user)
	{
		for(theuser in variables.instance.users)
		{
			variables.instance.users[theuser].sendMessage(serializeJSON({result="userJoined",roomName="#variables.instance.name#",userName=arguments.user.getUserName()}));
		}
		variables.instance.users[user.getConnection().toString()]=arguments.user;
	}
	void function removeUser(string connection)
	{
		structDelete(variables.instance.users,connection);
	}
	void function isUserMember(string userName)
	{
		return StructKeyExists(variables.instance.user,userName);
	}
	void function sendMessage(string userName,string message)
	{
		for(user in variables.instance.users)
		{
			if(user != userName){
				variables.instance.users[user].sendMessage(arguments.message);
			}
		}
	}
	public string function getName()
	{
		return variables.instance.name;
	}
	struct function toStruct(){
		local.chatRoomStruct.users=arrayNew(1);
		local.chatRoomStruct.name=variables.instance.name;
		for(user in variables.instance.users)
		{		
			ArrayAppend(local.chatRoomStruct.users,{userName=variables.instance.users[user].getUserName()});
		}
		return local.chatRoomStruct;
	}
}