var globalState = "";

$(document).ready(function () {
  var content = $(".ck .ck-content")[0];
  var dataContent = content.innerHTML;

  globalState = dataContent;

  const settings = {
    async: true,
    crossDomain: true,
    url: "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/en/index.json",
    method: "GET",
    headers: {},
  };
  $.ajax(settings).done(function (response) {
    $("#SurahNames").val(JSON.stringify(response));
    response.forEach((element) => {
      var newOption =
        "<option value='" +
        element.id +
        "' link='" +
        element.link +
        "''>" +
        element.name +
        "</option>";
      $("#Surahs").append(newOption);
    });
  });
  
  StartSaving()
});
$("#Surahs").on("change", function (e) {
  var SurahLink = $(this).children("option:selected").attr("link");
  GetSurahAyahs(SurahLink);
});
function GetSurahAyahs(link) {
  $("#Ayahs").html('');
  $("#Ayahs").append("<option value=''>--Select--</option>");
  const AyahSettings = {
    async: true,
    crossDomain: true,
    url: link,
    method: "GET",
  };
  $.ajax(AyahSettings).done(function (response) {
    response.verses.forEach((element) => {
      let Ayah = element.text;
      let Translation = element.translation;
      let id = element.id;
      let option =
        "<option value='" +
        id +
        "' text='" +
        Ayah +
        "' translation='" +
        Translation +
        "'>" +
        id +
        "</option>";
      $("#Ayahs").append(option);
    });
  });
}
$("#Ayahs").on("change",function(){
  SetAyah();
})
function SetAyah(){
  $("#divAyah").html("");
  $("#divTranslation").html("");
	let CurrentAyah = $("#Ayahs").children("option:selected");
	let text = CurrentAyah.attr("text");
  let AyahNumber = CurrentAyah.val();
  let SurahNumber = $("#Surahs").val();
  GetAyahWords(AyahNumber,SurahNumber,text);
}
function WordClicked(event){
	let word = event.textContent;
  navigator.clipboard.writeText(word);
  ShowCopyAlert();
}
function CopyAyah(){
  let Ayah = $("#Ayahs").children("option:selected").attr("text");
  if(Ayah){
    navigator.clipboard.writeText(Ayah);
    ShowCopyAlert();
  }
}
function CopyTranslation(){
  let Translation = $("#Ayahs").children("option:selected").attr("translation");
  if(Translation){
    navigator.clipboard.writeText(Translation);
    ShowCopyAlert();
  }
}
function CopyAyahandTranslation(){
	let CurrentAyah = $("#Ayahs").children("option:selected");
  let AyahNumber = CurrentAyah.val();
  let Ayah = $("#Ayahs").children("option:selected").attr("text");
  let Translation = $("#Ayahs").children("option:selected").attr("translation");
  if(Ayah && Translation){
    let text = "Ayah - " + AyahNumber + "\n" + Ayah + "\n" + Translation;
    navigator.clipboard.writeText(text);
    ShowCopyAlert();
  }
}
function ShowCopyAlert(){
  $("#spanAlert").css("display","inline");
  setTimeout(function(){
    $("#spanAlert").css("display","none");
  },1000);
}
function GetAyahWords(AyahNumber,SurahNumber,text){
  let textArr = text.split(" ");
  const AyahWordsSettings = {
    async: true,
    crossDomain: true,
    url: "https://api.quran.com/api/v4/verses/by_key/"+SurahNumber+":"+AyahNumber+"?language=en&words=true",
    method: "GET",
  };
  $.ajax(AyahWordsSettings).done(function(response){
    let i = 0;
    textArr.forEach(element => {
      let WordTranslation = response.verse.words[i].translation.text;
      let Ayah_Word = "<span class='AyahWord' onclick='WordClicked(this)' title='" + WordTranslation +"'>" + element + "</span>&nbsp;&nbsp;&nbsp;";
      $("#divAyah").append(Ayah_Word);
      i++;
    });
    let AyahTranslation = $("#Ayahs").children("option:selected").attr("translation");
    $("#divTranslation").text(AyahTranslation);
  })
}
function ChangeAyah(next){
  let currentAyah = $("#Ayahs").val();
  let NextAyah = 0;
  NextAyah = parseInt(currentAyah) ? parseInt(currentAyah) : 0;
  NextAyah = next ? NextAyah + 1 : NextAyah - 1;
  $("#Ayahs").val(NextAyah);
  SetAyah();
}
$("body").keyup(function(event){
 if(event.altKey){
  if(event.which == 65){
    CopyAyah();
  }
  if(event.which == 84){
    CopyTranslation();
  }
  if(event.which == 187){
    ChangeAyah(true);
  }
  if(event.which == 189){
    ChangeAyah(false);
  }
  if(event.which == 66){
    CopyAyahandTranslation();
  }
  if(event.which == 67){
    AlignTextCenter();
  }
  if(event.which == 76)
  AlignTextLeft();
}
})

function StartSaving(){
  setTimeout(()=>{
    SaveState()
  },1000);
}

function AlignTextCenter(){
  $("button[data-cke-tooltip-text='Align center']")[0].click()
}

function AlignTextLeft(){
  $("button[data-cke-tooltip-text='Align left']")[0].click()
}
function SaveState(){
  var content = $(".ck .ck-content")[0];
  let dataContent = content.innerHTML;
  if(globalState != dataContent){
    globalState = dataContent;
    document.getElementById("loader").style.display = "block";
  const SaveCallSetting = {
    async : true,
    method : "POST",
    contentType: 'application/json',
    url : "http://localhost:3000/save",
    data : JSON.stringify({html : dataContent})
  }
  $.ajax(SaveCallSetting).done(function(response){
    console.log(response);
    document.getElementById("loader").style.display = "none";
    StartSaving();
  })
}
else{
  StartSaving();
}
}