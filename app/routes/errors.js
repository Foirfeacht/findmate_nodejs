module.exports = function(app) {	
	// Handle 404
	  app.use(function(req, res) {
	      res.status(400);
	     res.render('errors/404.ejs', { status: 404, url: req.url });
	  });
	  
	  // Handle 500
	  app.use(function(error, req, res, next) {
	      res.status(500);
	     res.render('errors/500.ejs');
	  });
}