module.exports = function ( app ) {
    app.get('/home', function (req, res) {
        if(req.session.user){
            var Commodity = global.dbHelper.getModel('commodity');
            Commodity.find({}, function (error, docs) {
               //找到Commodity傳入頁面
               res.render('home',{Commoditys:docs, user: req.session.user});
            });
        }else{
            req.session.error = "請先登錄"
            res.redirect('/login');
        }
    });

	 app.get('/addcommodity', function(req, res) {
        res.render('addcommodity');
    });
    app.post('/addcommodity', function (req, res) {
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.create({
            name: req.body.name,
            price: req.body.price,
            imgSrc: req.body.imgSrc
        }, function (error, doc) {
            if (doc) {
                res.send(200);
            }else{
                res.send(404);
            }
        });
    });
	
	
	
	}


