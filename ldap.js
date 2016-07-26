			adminClient.search(req.body.ldap_suffix, {
				scope: "sub",
				filter: "(uid=" + sessionData.uid + ")"
			}, function(err, ldapResult) {
				if (err != null)
					throw err;
				else {
					// If we get a result, then there is such a user.
					ldapResult.on('searchEntry', function(entry) {
						sessionData.dn = entry.dn;
						sessionData.name = entry.object.cn;
						
						// When you have the DN, try to bind with it to check the password
						var userClient = ldap.createClient({
							url: sessionData.ldap.url
						});
						userClient.bind(sessionData.dn, sessionData.passwd, function(err) {
							if (err == null) {
								var sessionID = logon(sessionData);
								
								res.setHeader("Set-Cookie", ["sessionID=" + sessionID]);
								res.redirect("main.html");
							} else
								res.send("You are not " + sessionData.uid);
						});
					});
					
					// If we get to the end and there is no DN, it means there is no such user.
					ldapResult.on("end", function() {
						if (sessionData.dn === "")
							res.send("No such user " + sessionData.uid); 
					});
				}

			});