
 
 function getDms(val) {
 
    var valDeg, valMin, valSec, result;
  
    val = Math.abs(val);
  
    valDeg = Math.floor(val);
    result = valDeg + "º";
  
    valMin = Math.floor((val - valDeg) * 60);
    result += valMin + "'";
  
    valSec = Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000;
    result += valSec + '"';
  
    return result;
  }

function ddToDms(lat, lng) {

    var latResult, lngResult, dmsResult;
 
    lat = parseFloat(lat);  
    lng = parseFloat(lng);
 
    latResult = (lat >= 0)? 'N' : 'S';
    
    latResult += getDms(lat);
 
    lngResult = (lng >= 0)? 'E' : 'W';
    
    lngResult += getDms(lng);
 
    
    dmsResult = latResult + ' ' + lngResult;
    
    return dmsResult;
 }

 export const convertDd = (lat ,long) => ddToDms(lat, long);

 export  const types = [
   {
     title : "Small",
     value : "small"
   },
   {
     title : "Medium",
     value : "medium"
   },
   {
     title : "Large",
     value : "large"
   },
   {
     title : "Heliport",
     value : "heliport"
   },
   {
     title : "Closed",
     value : "closed"
   },
   {
     title : "In your favorites",
     value : "inYourFavorites"
   }
 ];