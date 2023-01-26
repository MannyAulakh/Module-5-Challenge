
$(function () {

  //-----------------1) Saving Description to Local Storage-----------------------

  saveButtonEl = $(".fa-save")
  //Initiate function when a save button is clicked
  saveButtonEl.on("click", function(event){
    event.preventDefault();
    
    //Retrieve the corresponding Text & Time ID
    var enteredText = $(this).parent().siblings(".description").val()
    var blockID = $(this).parent().parent().attr("id")

    Events = localStorage.getItem("Events")

    //If local storage does not exist, create JSON & add first value
    if (Events == null) {
      var Events = {
        TimeID: [blockID],
        EventDesc: [enteredText]
      };
      localStorage.setItem("Events", JSON.stringify(Events));
      // If local storage exists, check to see if TimeID exits and update corresponding Text
    } else {
      Events = JSON.parse(Events)
      for (i = 0; i < Events.TimeID.length; i++){
        if (Events.TimeID[i] == blockID) {
          Events.EventDesc[i] = enteredText
          break
        } 
      }
      //If TimeID does not exist, append new TimeID & Text to each array
      if (i >= Events.TimeID.length) {
        Events.TimeID.push(blockID)
        Events.EventDesc.push(enteredText)
      }
      localStorage.setItem("Events", JSON.stringify(Events))
    }
  })

//-----------------2) Assigning class (colour) to each time block based on current time-----------------------

  //Retrieve all blocks
  scheduleListEl = $(".container-fluid").children()

  //Retrieve current hour
  currentHour = dayjs().hour()

  //Loop through each block and check to see if ID is in the past, present, or future
  for (var i= 0; i < scheduleListEl.length; i++) {
    //Convert TimeID of current block to a number so it can be compared to current hour
    let blockTime = parseInt(scheduleListEl.eq(i).attr("id").replace("hour-",""))
    if (blockTime < currentHour) {
      scheduleListEl.eq(i).addClass("row time-block past")
    } else if (blockTime > currentHour) {
      scheduleListEl.eq(i).addClass("row time-block future")
    } else if (blockTime == currentHour) {
      scheduleListEl.eq(i).addClass("row time-block present")
    }
  }


//-----------------3) Retrieve Description from Local Storage-----------------------

  //Retrieve local storage and parse JSON
  Events = localStorage.getItem("Events")
  Events = JSON.parse(Events)

  //Check each block to see if a saved description exits & display result
  for (var i= 0; i < scheduleListEl.length; i++) {
    let blockEl= scheduleListEl.eq(i).attr("id")
    for (x = 0; x < Events.TimeID.length; x++) {
      if (blockEl == Events.TimeID[x]) {
        scheduleListEl.eq(i).children().eq(1).text(Events.EventDesc[x])
      }
    }
  }

//-----------------4) Display current Day, Month & Date in the header -----------------------

  var today = dayjs().format('dddd, MMM D')
  var todaydateEl = $('#currentDay') //EL
  todaydateEl.text(today)
});
