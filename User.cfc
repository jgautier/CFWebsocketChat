component output="false"  {
	variables.instance=structnew();
	variables.instance.connection="";
	variables.instance.userName="";
	void function init(connection,userName)
	{
		variables.instance.connection=arguments.connection;
		variables.instance.userName=arguments.userName;
	}
	void function sendMessage(message)
	{
		variables.instance.connection.send(message);
	}
	string function getUserName()
	{
		return variables.instance.userName;
	}
	any function getConnection()
	{
		return variables.instance.connection;
	}
}
