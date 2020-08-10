class taxi{
    constructor()
    {
    this.location = 'A';
    this.amount = 0;
    this.custId=[];
    this.time=[];
    }
}

class customer {
    constructor(pickUpPoint, dropPoint, pickUpTime, dropTime, fare) {
        this.pickUpPoint = pickUpPoint;
        this.dropPoint = dropPoint;
        this.pickUpTime = pickUpTime;
        this.dropTime = dropTime;
        this.fare = fare;
    }
}

var taxiCount=3, customerId=0, taxis=[], customers=[], table;

var book = document.getElementById('bookTaxi');
book.addEventListener('click', bookTaxi, false);

var taxiState = document.getElementById('taxiStatus');
taxiState.addEventListener('click', taxiStatusUtility, false);

var object = document.getElementById('taxiAlloted');

var display = document.getElementById('display');

document.getElementById('pickUpPoint').addEventListener('focus', function(){
    display.textContent='';
    object.textContent='';
}, false);

window.onload = function() {

    pickUpPoint.focus();
    var today = new Date();
    var hrs = today.getHours();
    var greeting;
    if(hrs > 18)
      greeting = 'Good Evening';
    else if(hrs > 12) 
      greeting = 'Good Afternoon';
    else if (hrs > 0)
      greeting = 'Good Morning';
    else
      greeting = 'Welcome';
    document.getElementById('greeting').innerHTML=`${greeting}! Book a Taxi &#9829;`;

    for(var taxiNo=0; taxiNo<taxiCount; taxiNo++)
    {
      taxis.push(new taxi());    
      for(var hr=0; hr<24; hr++)
      taxis[taxiNo].time.push(0);
    }

  };

function bookTaxi()
{
    display.innerHTML='';
    var pickUpPoint, dropPoint, pickUpTime, dropTime, distance, bookedTaxi=-1, optimalDis = Number.MAX_VALUE, time, fare;
    
    pickUpPoint = document.getElementById('pickUpPoint').value;
    dropPoint = document.getElementById('dropPoint').value;
    pickUpTime = document.getElementById('pickUpTime').value;

    if(pickUpPoint=='' || dropPoint=='' || pickUpTime=='' || pickUpPoint==dropPoint)
    {
        object.textContent='Invalid input !';
        return;
    }

    time = Math.abs(dropPoint.charCodeAt(0) - pickUpPoint.charCodeAt(0));
    distance = time*15;
    fare = (distance-5)*10 + 100;
    dropTime = parseInt(pickUpTime) + time;

    customers.push(new customer(pickUpPoint, dropPoint, pickUpTime, dropTime, fare));       
    
    if(customerId==0)
        bookedTaxi=0;
    else
    {
        for(var taxiNo=0; taxiNo<taxiCount; taxiNo++)
        {
            if(taxis[taxiNo].time[pickUpTime] == 0)
            {
                var temp = Math.abs(taxis[taxiNo].location.charCodeAt(0)-pickUpPoint.charCodeAt(0));
                 if(temp < optimalDis)
                 {
                     optimalDis = temp;
                     bookedTaxi = taxiNo;
                 }
                 else if(temp == optimalDis)
                 {
                    if(taxis[bookedTaxi].amount > taxis[taxiNo].amount)
                     bookedTaxi = taxiNo;
                 }
            }
        }
    }


    if(bookedTaxi != -1)
    {
        for(var hr=pickUpTime; hr<dropTime; hr++)
        taxis[bookedTaxi].time[hr]=1; 

        taxis[bookedTaxi].amount+=fare;
        taxis[bookedTaxi].location=dropPoint;
        taxis[bookedTaxi].custId.push(customerId);

        object.textContent = `Taxi - ${bookedTaxi+1} is alloted. Taxi fare - Rs.${fare}. Happy ride!`;
    }
    else
        object.textContent = 'We are sorry! All taxis are booked.';

   customerId++;
   clear();
}


function clear()
{
   document.getElementById('pickUpPoint').value='';
   document.getElementById('dropPoint').value='';
   document.getElementById('pickUpTime').value='';
}

function taxiStatusUtility()
{
    clear();
    object.textContent='';
    table='';

    for(var taxiNo=0; taxiNo<taxiCount; taxiNo++)
    taxiStatus(taxiNo);

    display.innerHTML = table;
}

function taxiStatus(taxiNo)
{       
       table+=`<h1> Taxi - ${taxiNo*1 + 1} </h1> <br>
       <table class='center'> 
       <tr> 
       <th> CustomerId  </th> 
       <th> Pickup point </th>
       <th> Drop point </th>
       <th> Pickup Time </th>
       <th> Drop Time </th> 
       <th> Amount </th>
       </tr>`;

       for(var cust=0; cust<taxis[taxiNo].custId.length; cust++)
       {
           var index=taxis[taxiNo].custId[cust];

           table+=`<tr>
            <td>${index*1 + 1}</td>
            <td> ${customers[index].pickUpPoint} </td> 
            <td> ${customers[index].dropPoint} </td> 
            <td> ${customers[index].pickUpTime} </td> 
            <td> ${customers[index].dropTime} </td> 
            <td> ${customers[index].fare} </td>
            </tr>`; 
       }

       table+=`</table> <br> Earnings - Rs.${taxis[taxiNo].amount} <br> <br> <br>`;
}
