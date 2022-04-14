module.exports.GET = async function(req, serve, vars, evars) {
	var HTML = evars.HTML;
	var user = evars.user;

	var loadShellFile = vars.loadShellFile;
	var shellEnabled = vars.shellEnabled;

	if(!user.superuser) return;
	if(!shellEnabled) return serve("Shell is not enabled");

	/*
	shell.js template:

	shell.main = async function() {
		return "response message";
	}
	*/

	var query_data = evars.query_data;

	if(query_data.command == "load") {
		var data = loadShellFile();
		if(data) {
			return serve(data);
		} else {
			return serve(null, 404);
		}
	}

	serve(HTML("administrator_shell.html"));
}

module.exports.POST = async function(req, serve, vars, evars) {
	var post_data = evars.post_data;
	var user = evars.user;

	var runShellScript = vars.runShellScript;
	var shellEnabled = vars.shellEnabled;

	if(!user.superuser) return;
	if(!shellEnabled) return serve("Shell is not enabled");

	if(post_data.command == "exec") {
		var result = await runShellScript(post_data.colors === "true");
		return serve(result);
	} else {
		return serve(null, 400);
	}
}