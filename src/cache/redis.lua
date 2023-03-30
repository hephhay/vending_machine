local prefix = ARGV[1]
local function handleEvent(event_key)
	local parts = string.match(event_key, "^(.-):(.-):(.*)$")
	local sessionStore = parts[1] .. ":" .. parts[2]
	redis.call("SREM", sessionStore, event_key)
	end
redis.call(
	"psubscribe",
	"__keyevent@0__:del",
	"__keyevent@0__:expired",
	"__keyspace@0__:" .. prefix .. "*:*",
	function (err, event)
		if event[1] == "pmessage" then
			local modifiedEvent = string.gsub(
				event[3],
				"^__keyspace@0__:",
				""
			)
			handleEvent(modifiedEvent)
		end
	end)