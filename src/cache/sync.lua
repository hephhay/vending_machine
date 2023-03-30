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
	"__keyspace@0__:" .. prefix .. "*:*"
)
while true do
    local message = redis.call("pmessage", 0, "__key*__:*")
    local modifiedEvent = string.gsub(message[3], "^__keyspace@0__:", "")
    handleEvent(modifiedEvent)
end