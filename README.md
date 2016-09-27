# README #

### Background ###

* This is the website code of Gender Statistics. The goal of this project is to create a new interactive website to replace the [old Gender Statistics website](http://genderstats.un.org/)
* Version: 1.2
* Demos:
    - [Development demo by APIS](https://unite.un.org/sites/unite.un.org/files/app-desa-genderstats/index.html#/home)
    - [Demo hosted by DESA](http://genderstats.un.org/beta/index.html#/home)
    - [Demo hosted by Qlik](http://webapps.qlik.com/un/gender-statistics/index.html#/home)
* Technology used: [Angular.js](https://angularjs.org/), Javascript, [QlikSense API](https://help.qlik.com/en-US/sense-developer/3.0/Content/api-version-history.htm)
* The QlikSense application is hosted on Qlik team's server and APIS' QlikSense production server. For the two apps hosted on APIS' server, Minimum Set of Gender Indicators is the one on use for live demos; Minimum Set of Gender Indicators 2 is the one used in this repositories. 
* Other relevant documents are available at Unite Connections

### How do I get set up? ###

* Steps
    - Down load the repository by `git clone https://lemonsong@bitbucket.org/oictviz/gender-statistics.git` or click the Download button at the left menu
    - Use [BabyWebServer (Windows)](http://www.pablosoftwaresolutions.com/html/baby_web_server.html) or [MAMP (MAC)](https://www.mamp.info/en/) to develop the website on your local desktop, because other ways, such as SimpleHTTPServer, cannot have your website connect to the qlik server
* Configuration
    - Pay attention to the configuration files: 
        - `scriptsUrl` and `baseUrl` in gender-statistics\js\lib\main.js
        - `me.config` in gender-statistics\js\lib\app.js
* Refer to the Checklist of Gender Statistics for future development


### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

- Developed by Yianni Ververis, Daniela Marin Puentes, Kania Azrina, Yilin Wei etc. 
- Refer to the transition documentation about stakeholders