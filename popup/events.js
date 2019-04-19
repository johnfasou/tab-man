console.log("events.js started");

function setEventListeners() {
  // onclick event listener
  window.onclick = onclick_callback;

  function onclick_callback(event) {

    let tmp;
    let tmp_ar = event.target.id.split("_");
    let id = tmp_ar[0];
    let cmd = tmp_ar[1];
    let ii = b.findPosById(id);
    log("click cmd:" + cmd + "  id:" + id);

    switch (cmd) {

      // Menu
      case "selecttoggle":
        tm.list[ii].checked =
          document.getElementById(id + "_selecttoggle").checked;
        b.saveToStorage(); // Save to storage
        break;

      case "selecttoggle_all":
        if (document.getElementById("_selecttoggle_all").checked) {
          bulkSelect();
        } else {
          bulkUnSelect();
        }
        b.saveToStorage(); // Save to storage
        createview();
        break;

      case "bulkselect":
        bulkSelect();
        b.saveToStorage(); // Save to storage
        createview();
        break;

      case "bulkunselect":
        bulkUnSelect();
        b.saveToStorage(); // Save to storage
        createview();
        break;

        function bulkSelect() {
          for (let ii in tm.list) {
            tm.list[ii].checked = true;
          }
        }

        function bulkUnSelect() {
          for (let ii in tm.list) {
            tm.list[ii].checked = false;
          }
        }

        // General menu
      case "remove":
        msg("Deleted");
        delete tm.list[ii];
        b.saveToStorage(); // Save to storage
        createview();
        break;

      case "bulkremove":
        for (let ii in tm.list) {
          if (tm.list[ii].checked) {
            tm.list[ii].checked = false;
            msg("Changed to hidden");
          }
        }
        msg("Hidden");
        b.saveToStorage(); // Save to storage
        createview();
        break;


      case "clipcopy":
        saveToClipboard(joinUrls(ii, "text", 0));
        msg("Copied to clipboard");
        break;

      case "bulkclipcopy":
        let output = "";
        for (let ii in tm.list) {
          if (tm.list[ii].checked) {

            log("ID: " + id + " | " + tm.list[ii].checked);
            output += tm.list[ii].name + "\n";
            output += joinUrls(ii, "text", 0);
            output += "\n";
          }
        }
        saveToClipboard(output);
        msg("bulk clip copy");
        break;


      case "inpage":
        //openNewWindow("page.html");
        openNewTabs("/popup/page.html"); // /popup/page.html"
        msg("List opened in new Tab");
        break;

        // show or hide pastearea
      case "pasteareashow":
        tmp = document.getElementById("_pastearea");
        //let y = document.getElementById("_paste");
        if (tmp.style.display === "block") {
          tmp.style.display = "none";
          //y.innerHTML = "Paste ▼";
        } else {
          tmp.style.display = "block";
          document.getElementById("_pastearea_txt").innerText = tm["_addarea"];
          //y.innerHTML = "Done ▲";
        }
        break;

      case "pastenow":
        tmp = document.getElementById("_pastearea");
        let res = grabUrlsFromString(tmp.innerText);
        tmp.innerText = res.join("\n");
        openNewWindow(res);
        break;


        // Item menu
      case "collapse":
        toggleCollapse(id);
        break;

      case "Show":
        tmp = parseInt(id.replace("id", ""));
        browser.windows.update(tmp, {
          focused: true
        });
        break;

      case "Open":
        // create array with urls to open
        let urls = joinUrls(ii, "url", 0);
        log(urls);
        for (let i in urls) {
          if (urls[i] == "about:newtab" || urls[i] == "chrome://newtab/") {
            delete urls[i];
          }
        }
        urls = urls.trim().split(" "); // convert to array
        log("Open urls: " + urls)
        openNewWindow(urls); // ASDF
        break;


      case "moveup":
        moveItemUp(id);
        b.saveToStorage(); // Save to storage
        createview();
        break;

      case "movedown":
        moveItemDown(id);
        b.saveToStorage(); // Save to storage
        createview();
        break;


      case "bulkmoveup":
        wlen = (tm.list.length - 1);
        for (let i in tm.list) {
          //log("# bulkmoveup  ii: " + i + " " + tm.list[i]);
          if (tm.list[i].checked) {
            moveItemUp(i);
          }
        }
        b.saveToStorage(); // Save to storage
        createview();
        break;

      case "bulkmovedown":
        log(tm);
        wlen = (tm.list.length - 1);
        for (let i = wlen; i >= 0; i--) {
          //log("i: " + i);
          //for (let i in tm.list){
          if (tm.list[i].checked) {
            moveItemDown(i);
          }
        }
        b.saveToStorage(); // Save to storage
        createview();
        break;

        function moveItemUp(i) { //  0  << ... ii ... end
          if (i == 0) {
            return
          }
          let i2 = parseInt(i, 10) - 1;
          let temp = tm.list[i];
          tm.list[i] = tm.list[i2];
          tm.list[i2] = temp;
        }

        function moveItemDown(i) {
          if (i == (tm.list.length - 1)) {
            return
          }
          log("Moving Down ii: " +i);
          let i2 = parseInt(i, 10) + 1;
          let temp = tm.list[i];
          tm.list[i] = tm.list[i2];
          tm.list[i2] = temp;
        }
        // function findPosById (id){
        //   for (let item in tm.list["viewid"]) {
        //     if (tm.list["viewid"][item] == id){return item;}
        //   }
        // }
        // function findInWinlist (id){
        //   for (let item in tm.list) {
        //     if (tm.list[item] == id){ return item; }
        //   }
        // }

        // Testing buttons
      case "dedup":
        b.tabsSync().then(function (ret) {
          b.cleanupDuplicateTabs().then(function (ret) {
            msg("test");
            createview();
          });
        });
        break;

      case "test":
        // Run unittests
        //unittests();
        b.test_AddDuplicateWindow();
        break;


      case "check":
        b.checkStorageIntegrity();
        break;


      case "clean":
        browser.storage.local.remove("tabman", function () {
          if (browser.runtime.lastError) {
            log(browser.runtime.lastError);
          } else {
            b.tabsSync();
            tm = b.tm;
            createview();
            msg("Cleared");
          }
        });
        break;

      default:
        break;
    }

  }
}
//  Submit listener
//window.oninput(oninput_callback);
//function oninput_callback(event) {
//  log("submit: " + event.target.value);
//}

//  Text "enter" key listener 
document.addEventListener("keypress",
  (event) => {
    if (event.keyCode == 13) {
      //event.preventDefault();
      nameChange(event);
    }
  }
);
// onlostfocus listener
// document.addEventListener("focusout", nameChange);
function nameChange(event) {
  tmp_ar = event.target.id.split("_");
  if (!(tmp_ar.length)) {
    return;
  }
  id = tmp_ar[0];
  cmd = tmp_ar[1];
  let ii = b.findPosById(id);
  log("keypress (enter):  id:" + id + " cmd:" + cmd);

  switch (cmd) {

    case "pastearea":
      let str = event.target.innerText;
      //log(str);
      tm["_addarea"] = str;
      b.saveToStorage(); // Save to storage
      //let res = grabUrlsFromString(str);
      //log(res);
      break;

    default:
      tm.list[ii].name = event.target.value;
      msg("Window title changed");
      b.saveToStorage(); // Save to storage
      break;
  }
}

  // Open new window
  function openNewWindow(urls) {
    log(urls);
    let creating = browser.windows.create({
      "url": urls
    });
  }
  // Open new tabs
  function openNewTabs(urls) {
    let creating = browser.tabs.create({
      "url": urls
    });
  }

  function toggleCollapse(idspec) {
    let tmp = document.getElementById(idspec + "_Text");
    let btn = document.getElementById(idspec + "_collapse");

    if (tmp.style.display === "none") {
      tmp.style.display = "block";
      btn.innerHTML = "▲";
    } else {
      tmp.style.display = "none";
      btn.innerHTML = "▼";
    }
  }

  function saveToClipboard(newClip) {
    // updateClipboard("Clipboard Test");
    // Permision: "clipboard-write"
    navigator.clipboard.writeText(newClip).then(function () {
      /* clipboard successfully set */
    }, function () {
      msg("clipboard write failed");
    });
  }

  function grabUrlsFromString(str) {
    // let res = grabUrlsFromString(str);
    /*
    str = " \
    regexbuddy.com \
    www.regexbuddy.com \
    aa   http://regexbuddy.com \
    dds http://www.regexbuddy.com \
    href="http://www.regexbuddy.com/" \
    http://www.regexbuddy.com/index.html \
    dds  http://www.regexbuddy.com/index.html?source=library \
    sddf http://www.regexbuddy.com/download.html. dfsdf \
    www.domain.com/quoted \
    http://10.2.2.1.2/ttxx/txt/gg \
    ";
    */
    // ***  let re = /(https?):\/\/(www\.)?[a-z0-9\.:].*?(?=\s)/gi;
    let re = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    return str.match(re);
  }

  function grabUrlsFromString2(str) {
    let re = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return str.replace(re, function (url) {
      return '<a href="' + url + '">' + url + '</a>'; // SINGLE QUOTES
    });
  }




