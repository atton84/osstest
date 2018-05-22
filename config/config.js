var config = {
	local: {
		mode: 'local',
		port: 2017,
		mongo: {
			host: '127.0.0.1',
			port: 27017,
      		base: 'ossystemtest'
		},
		imagePath:"/public/images/",
		logFile:"/logs/all-logs.log",
		viewsFolder:'views'
	}
}

module.exports = function(mode) {
	return  config.local;
}
