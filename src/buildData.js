var parseString = require('xml2js').parseString;
// import webrazziLogo from './images/webazzi.png'; 

function getTechNews(respondArray, webSitesArray){
  let webSiteArrays = [];
  for(let key in respondArray){
    if(webSitesArray[key] == "https://webrazzi.com/feed/"){
      webSiteArrays.push(dataTemplate1(respondArray[key], 'Webrazzi')); 
    }
    else if(webSitesArray[key] == 'https://teyit.org/feed/'){
      webSiteArrays.push(dataTemplate2(respondArray[key], 'Teyit')); 
    }
    else if(webSitesArray[key] == "https://techcrunch.com/feed/"){
      // templateFinder(respondArray[key], 'TechCrunch');
    }
    else if(webSitesArray[key] == 'http://www.diken.com.tr/feed/'){
      webSiteArrays.push(dataTemplate3(respondArray[key], 'Diken'));
    }
    else if(webSitesArray[key] == 'http://www.thegeyik.com/feed/'){
      webSiteArrays.push(dataTemplate4(respondArray[key], 'The Geyik'));
    }
    else if(webSitesArray[key] == 'https://www.dunyahalleri.com/feed/'){
      // returnVal.push(...dataTemplate2(respondArray[key], 'Dünya Halleri'));
      templateFinder(respondArray[key], 'TechCrunch');
    }
  } 
  const maxLength = Math.max(...(webSiteArrays.map(arr => arr.length))); 
  return mixArrays(webSiteArrays, maxLength);
}

function getSportNews(respondArray, webSitesArray){
 
  return [];
}

function getBussinesNews(respondArray, webSitesArray){
  
  return [];
}

function getScienceNews(respondArray, webSitesArray){
  
  return [];
}

function getGamingNews(respondArray, webSitesArray){
  
  return [];
}

function getAutoNews(respondArray, webSitesArray){
  
  return [];
}

function getIndustryNews(respondArray, webSitesArray){
   
  return [];
}

function getCinemaNews(respondArray, webSitesArray){
   
  return [];
}

function getArtsNews(respondArray, webSitesArray){
   
  return [];
}

function getHealthNews(respondArray, webSitesArray){
  
  return [];
}

function getTravelNews(respondArray, webSitesArray){
  return [];
  
}

function getFashionNews(respondArray, webSitesArray){
  return [];
}


export function getAllMixedNews(content){ 
  let allNews = [];

  allNews.push(...getTechNews(content.techRes, content.technology));
  // let techNews = getTechNews(content.techRes, content.technology);
  // let sportNews = getSportNews(content.sportRes, content.sports);
  // let bussinesNews = getBussinesNews(content.bussinesRes, content.bussines);
  // let scienceNews = getScienceNews(content.scienceRes, content.science);
  // let gamingNews = getGamingNews(content.gamingRes, content.gaming);
  // let autoNews = getAutoNews(content.autoRes, content.auto);
  // let industryNews = getIndustryNews(content.industryRes, content.industry);
  // let cinemaNews = getSportNews(content.cinemaRes, content.cinema);
  // let artNews = getArtsNews(content.artRes, content.arts);
  // let healthNews = getHealthNews(content.healthRes, content.health);
  // let travelNews = getTechNews(content.travelRes, content.travel);
  // let fashionNews = getFashionNews(content.fashionRes, content.fashion);

  // let maxLength = Math.max(techNews.length, sportNews.length, bussinesNews.length,
  //   scienceNews.length, gamingNews.length, autoNews.length, industryNews.length,
  //   cinemaNews.length, artNews.length, healthNews.length, travelNews.length, fashionNews.length);

  //  for(let i = 0; i < maxLength; i++){
  //   if(techNews[i]){
  //     allNews.push(techNews[i]);
  //   }

  //   if(sportNews[i]){
  //     allNews.push(sportNews[i]);
  //   }

  //   if(bussinesNews[i]){
  //     allNews.push(bussinesNews[i]);
  //   }

  //   if(scienceNews[i]){
  //     allNews.push(scienceNews[i]);
  //   }

  //   if(gamingNews[i]){
  //     allNews.push(gamingNews[i]);
  //   }

  //   if(autoNews[i]){
  //     allNews.push(autoNews[i]);
  //   }

  //   if(industryNews[i]){
  //     allNews.push(industryNews[i]);
  //   }

  //   if(cinemaNews[i]){
  //     allNews.push(cinemaNews[i]);
  //   }

  //   if(artNews[i]){
  //     allNews.push(artNews[i]);
  //   }

  //   if(healthNews[i]){
  //     allNews.push(healthNews[i]);
  //   }

  //   if(travelNews[i]){
  //     allNews.push(travelNews[i]);
  //   }

  //   if(fashionNews[i]){
  //     allNews.push(fashionNews[i]);
  //   }
  //  }

   return allNews;
}

  
/*it supports to: 
 webrazzi.com
*/ 
function dataTemplate1(data, webSiteName){
  const returnVal = []; 
  parseString(data, function(err, result){ 
    const news = result.rss.channel[0].item;
    news.forEach(currentObject => {
      const currentNews = {};
      currentNews.webSite = webSiteName, 
      currentNews.title = currentObject.title[0];
      currentNews.content = currentObject.description[0];
      currentNews.pubDate = currentObject.pubDate[0];
      currentNews.newsPicUrl = currentObject['media:thumbnail'][0]['$'].url;
      if(currentObject.description[0].length > 10){ 
        returnVal.push(currentNews);
      }
    });
  }); 
  return returnVal;
}


/* it supports to : 
  http://www.teyit.org/feed/
*/
function dataTemplate2(data, webSiteName){
  const returnVal = []; 
  parseString(data, function(err, result){ 
    const news = result.rss.channel[0].item;
    news.forEach(currentObject => {
      const currentNews = {};
      currentNews.webSite = webSiteName, 
      currentNews.title = currentObject.title[0];
      currentNews.pubDate = currentObject.pubDate[0]; 
        
      //description içerisinde 2 adet paragraf var birincisi içerik içkincisi link. slice ile sadece içerik alınıyor
      let content =  currentObject.description[0].replace('[&#8230;]', '');;

      const imageStart = content.indexOf('src=');
      const imageEnd = content.indexOf('class=');
      
      if(content.indexOf('İDDİA') !== -1){
        const titleStart = content.indexOf('İDDİA');
        const titleEnd = content.indexOf('YANLIŞ');
        const text = content.slice(titleStart, titleEnd+6);
        content = content.replace(text, ''); 
      }


      let pictureUrl = content.slice(imageStart+4, imageEnd).trim();
      pictureUrl = pictureUrl.replace(/"/g, '');
      pictureUrl = pictureUrl.replace('-300x157', '');
      pictureUrl = pictureUrl.replace('-300x158', '');
      pictureUrl = pictureUrl.replace('-300x169', '');
      pictureUrl = pictureUrl.replace('-300x178', '');
      pictureUrl = pictureUrl.replace('-300x167', '');
      pictureUrl = pictureUrl.replace('-.jpg', '.jpg');
      currentNews.newsPicUrl = pictureUrl;

      if(content.indexOf('<p>', content.indexOf('</p>')) !== -1){
        const contentStart = content.indexOf('<p>');
        const contentEnd = content.indexOf('</p>');	  
        currentNews.content = content.slice(contentStart+3, contentEnd);
      }else{
        currentNews.content = content;
      } 
      if(content.length > 10){
        returnVal.push(currentNews); 
      }
    });
  });  
  return returnVal;
}


/* it supports to : 
http://www.diken.com.tr/feed/
*/
function dataTemplate3(data, webSiteName){
  const returnVal = []; 
  parseString(data, function(err, result){ 
    const news = result.rss.channel[0].item;
    news.forEach(currentObject => {
      const currentNews = {};
      currentNews.webSite = webSiteName, 
      currentNews.title = currentObject.title[0];
      currentNews.pubDate = currentObject.pubDate[0]; 
      
      //description içerisinde 2 adet paragraf var birincisi içerik içkincisi link. slice ile sadece içerik alınıyor
      let content =  currentObject.description[0].replace('[&#8230;]', '...');
      if(content.indexOf('<p>', content.indexOf('</p>')) !== -1){
        const start = content.indexOf('<p>');
        const end = content.indexOf('</p>');	  
        currentNews.content = content.slice(start+3, end);
      }else{
        currentNews.content = content;
      } 
      if(content.length > 10){
        returnVal.push(currentNews); 
      }
    });
  });  
  return returnVal;
}


/* it supports to : 
http://www.thegeyik.com/feed/
*/
function dataTemplate4(data, webSiteName){
  const returnVal = []; 
  parseString(data, function(err, result){ 
    const news = result.rss.channel[0].item;
    news.forEach(currentObject => {
      const currentNews = {};
      currentNews.webSite = webSiteName, 
      currentNews.title = currentObject.title[0];
      currentNews.pubDate = currentObject.pubDate[0]; 
      currentNews.content = currentObject.description[0].replace('[&#8230;]', '...'); 
      
      if(currentObject['content:encoded'][0].indexOf('img') !== -1){
        const imageStart = currentObject['content:encoded'][0].indexOf('img');
        const imageEnd = currentObject['content:encoded'][0].indexOf('alt');
        let pictureUrl = currentObject['content:encoded'][0].slice(imageStart+9, imageEnd).trim(); 
        pictureUrl = pictureUrl.replace(/"/g, '');
        if(!pictureUrl.startsWith('http')){
        //  const trueImageStart = currentObject['content:encoded'][0].indexOf('src=', imageStart);
        //  console.log(trueImageStart);
         console.log('Resim yanlış');
         currentNews.newsPicUrl = pictureUrl;
        } 
      }

      if(currentNews.content.length > 10){
        returnVal.push(currentNews); 
      }
    });
  });  
  return returnVal;
}


function templateFinder(data){
  parseString(data, function(err, result){ 
    console.log(result);
    // return result.rss.channel.item;
  });
}

function mixArrays(arrays, maxLength){
  let returnVal = []; 
  for(let i = 0; i < maxLength; i++){
    for(let j = 0; j < arrays.length; j++){
      if(arrays[j][i]){
        returnVal.push(arrays[j][i]);
      }
    }
  } 
  return returnVal;
}

