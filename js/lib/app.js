/*
 * @owner yianni.ververis@qlik.com
 *
 */
var me = {
		obj: {
			qlik: null,
			app: null,
			angularApp: null,
			model: []
		}
	};

me.init = function () {
	me.config = {
			host: null,
			prefix: null,
			port:null,
			isSecure: true
	};
	me.vars = {
		v: "1.10",
		config: {
			
			local: {
				host: 'localhost',
				prefix: "/",
				port: 443,
				isSecure: true,
				id: '29e455d1-5c86-4532-8ff3-dcb534749a84'
			},
			demos: {
				host: 'demos.qlik.com',
				prefix: "/",
				port: 443,
				isSecure: true,
				id: '5289cad1-c5d7-486e-9429-47484a5c1d14'
			},
			production: {
				host: 'sense-demo.qlik.com',
				prefix: "/",
				port: 443,
				isSecure: true,
				id: '5289cad1-c5d7-486e-9429-47484a5c1d14'
			},
			demoswebapps: {
				host: 'demoswebapps.qlik.com',
				prefix: "/",
				port: 443,
				isSecure: true,
				id: 'd4a4f97a-3a70-409d-9cd6-92d0d8b2fefa'
			},
			devUN: {
				host: 'viz.dev.un.org',
				prefix: "/visualization/",
				port: null,
				isSecure: true,
				id: 'f2c08d76-1bae-44ab-b3b9-5d47556e325f'
			},
			prodUN: {
				host: 'viz.unite.un.org',
				prefix: "/visualization/",
				port: null,
				isSecure: true,
				id:'63172c31-bf2d-4083-bc50-eb19e14978b5'
                //id: '34f5aa2c-a487-4026-9992-092ea8eed716'
			},
		}
	};
	me.config = me.vars.config.prodUN;
}

me.boot = function () {
	me.init();

	me.obj.app = me.obj.qlik.openApp(me.config.id, me.config);

	me.events();
};

me.events = function () {
	$( document ).ready(function() {
		$(".container").height($("body").height() - 50);
	});

	$(window).resize(function() {
	    $(".container").height($("body").height());
	});

	console.log('%c App ' + me.vars.v + ': ', 'color: red', 'Loaded!');

};

app = me;
