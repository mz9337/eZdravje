
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

var apiKey = "QKOjdLMUTFpQHoUEPGPl5oUB8Q2QACJZLR2zABEI";


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta) {
    ehrId = "";

    sessionId = getSessionId();
    
    if(stPacienta==1){
        var ime = "Janez";
        var priimek = "Novak";
        var datumRojstva = "1938-10-30T14:58";
        var cas = "2016-3-2T11:20Z";
        var telesnaVisina = "173";
        var telesnaTeza =  "63";
        var telesnaTemperatura =  "36.3";
        var sisKrvniTlak = "111";
        var diaKrvniTlak = "90";
        var nasKrvi = "45";
        //var datumRojstva = "13.10.2015";
    }else if(stPacienta==2){
        var ime = "Polde";
        var priimek = "Kranjc";
        var datumRojstva = "1938-10-30T14:58";
        var cas = "2016-5-11T17:33Z";
        var telesnaVisina = "188";
        var telesnaTeza =  "74";
        var telesnaTemperatura =  "36.3";
        var sisKrvniTlak = "99";
        var diaKrvniTlak = "77";
        var nasKrvi = "33";
    }else if(stPacienta==3){
        var ime = "Micka";
        var priimek = "Kovač";
        var datumRojstva = "1938-10-30T14:58";
        var cas = "2016-4-12T11:20Z";
        var telesnaVisina = "164";
        var telesnaTeza =  "58";
        var telesnaTemperatura =  "38.3";
        var sisKrvniTlak = "144";
        var diaKrvniTlak = "66";
        var nasKrvi = "66";
    }else{
        var ime = "";
        var priimek = "";
        var datumRojstva = "";
    }
    
    if (!ime || !priimek || !datumRojstva || ime.trim().length == 0 ||
      priimek.trim().length == 0 || datumRojstva.trim().length == 0) {
      toastr.warning("Prosim vnesite zahtevane podatke!");
    } else {
    	$.ajaxSetup({
    	    headers: {"Ehr-Session": sessionId}
    	});
    	$.ajax({
    	    url: baseUrl + "/ehr",
    	    type: 'POST',
    	    success: function (data) {
    	        var ehrId = data.ehrId;
    	        var partyData = {
    	            firstNames: ime,
    	            lastNames: priimek,
    	            dateOfBirth: datumRojstva,
    	            partyAdditionalInfo: [{key: "ehrId", value: ehrId}, {key: "zdravilo", value:""}]
    	        };
    	        $.ajax({
    	            url: baseUrl + "/demographics/party",
    	            type: 'POST',
    	            contentType: 'application/json',
    	            data: JSON.stringify(partyData),
    	            success: function (party) {
    	                if (party.action == 'CREATE') {
                          toastr.success("Uspešno kreiran EHR " + ehrId );
    	                }
    	                
    	                
    	                $('#preberiObstojeciEHR').append($('<option>', {
                            value: ehrId,
                            text: ime+ ' '+priimek
                        }));
                        $('#vitalniZnakiEhr').append($('<option>', {
                            value: ehrId+"|"+cas+"|"+telesnaVisina+"|"+telesnaTeza+"|"+telesnaTemperatura+"|"+sisKrvniTlak+"|"+diaKrvniTlak+"|"+nasKrvi,
                            text: ime+ ' '+priimek+' (vzorčni pacient)'
                        }));
                        $('#zdravilaObstojeciEHR').append($('<option>', {
                            value: ehrId,
                            text: ime+ ' '+priimek
                        }));
    	            },
    	            error: function(err) {
                         toastr.error("Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
    	            }
    	        });
    	    }
    	});
    }

  return ehrId;
}

function kreirajEHRzaBolnika() {
	sessionId = getSessionId();

	var ime = $("#kreirajIme").val();
	var priimek = $("#kreirajPriimek").val();
	var datumRojstva = $("#kreirajDatumRojstva").val();

	if (!ime || !priimek || !datumRojstva || ime.trim().length == 0 ||
      priimek.trim().length == 0 || datumRojstva.trim().length == 0) {
          toastr.warning("Prosim vnesite zahtevane podatke!");
		/*$("#kreirajSporocilo").html("<span class='obvestilo label " +
      "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");*/
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        var ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            dateOfBirth: datumRojstva,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}, {key: "zdravilo", value: ""}]
		        };
		        $.ajax({
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {

                          toastr.success("Uspešno kreiran EHR " +ehrId);
                          $('#preberiObstojeciEHR').append($('<option>', {
                            value: ehrId,
                            text: ime+ ' '+priimek
                          }));
                          $('#vitalniZnakiEhr').append($('<option>', {
                            value: ehrId,
                            text: ime+ ' '+priimek
                          }));
                          $('#zdravilaObstojeciEHR').append($('<option>', {
                            value: ehrId,
                            text: ime+ ' '+priimek
                        }));
		                }
		            },
		            error: function(err) {
		            	/*$("#kreirajSporocilo").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");*/
                        toastr.error("Napaka '" + JSON.parse(err.responseText).userMessage + "'!")
		            }
		        });
		    }
		});
	}
}

function pripisiZdravilo(ehrId, name) {
	console.log(ehrId +" "+name);
	
	$.ajax({
		url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
		type: 'GET',
		headers: {"Ehr-Session": sessionId},
    	success: function (data) {
    		var party = data.party;
    		
    		console.log(party);
    		//var base = party.partyAdditionalInfo;
			//var zdravilo = "";
			for(var i = 0; i<party.partyAdditionalInfo.length;i++){
				if(party.partyAdditionalInfo[i].key == "zdravilo"){
					party.partyAdditionalInfo[i].value += ", "+name;
				}
			}
			
			/*var parametriZahteve = {
			    body: party,
			};*/
			
			var partyData = {
				id: party.id,
    			version: party.version,
	            firstNames: party.ime,
	            lastNames: party.priimek,
	            dateOfBirth: party.datumRojstva,
	            //partyAdditionalInfo: [{key: "ehrId", value: ehrId}, {key: "zdravilo", value: "miha"}]
	            partyAdditionalInfo: party.partyAdditionalInfo
	        };
    		
    		$.ajax({
				url: baseUrl + "/demographics/party",
				type: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify(party),
		    	success: function (data) {
		    		//var party = data.party;
		    		toastr.success("Zdravilo uspešno pripisano");
		    	},
		    	error: function(err){
		    		toastr.error("Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
		    	}
			});
    	},
    	error: function(err){
    		
    	}
	});
	
}

function poisciZdravilo() {
	//sessionId = getSessionId();

	var zdravilo = $("#zdraviloIme").val();
	var ehrId = $("#zdravilaEHRid").val();

	if (!zdravilo || zdravilo.trim().length == 0) {
          toastr.warning("Prosim vnesitEe zahtevane podatke!");
	} else {
		delete $.ajaxSettings.headers["Ehr-Session"];
		
		$.ajax({
		    url: "https://rxnav.nlm.nih.gov/REST/drugs?name="+zdravilo,
		    //url: "https://api.fda.gov/drug/event.json?search="+zdravilo,
		    type: 'GET',
		    dataType: 'json',
    		cors: true,
		    success: function (res) {
		       console.log(res);
		       
		       var rezultat = "<table class='table table-striped table-hover'>";
		       
		       var base = res.drugGroup.conceptGroup;
		       for(var i = 0; i < base.length; i++){
		       		if(typeof(base[i].conceptProperties) != "undefined"){
		       			base = base[i].conceptProperties;
		       			break;
		       		}
		       }
		       if(typeof(base[0].name) == undefined){
		       		base=base[0];
		       }
		       console.log(base);
		       for(var i = 0; i < base.length; i++){
		       		if(i > 5){
		       			break;
		       		}
		       		console.log(base[i].name);
		       		//var funkc = "pripisi("'+ehrId+'", "'+base[i].name+'")";
		       		rezultat += "<tr><th>"+base[i].name+"</th><td><button type='button' class='btn btn-primary btn-xs' onclick='pripisiZdravilo(\""+ehrId+"\", \""+base[i].name+"\")'>Pripiši</button></td></tr><br>";
		       }
		       
		       rezultat += "</table>";
		       $("#rezultatIskanjaZdravil").html(rezultat);
		       
		    },
		    error: function(err) {
                toastr.error("Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
            }
		});
		
		$.ajaxSettings.headers["Ehr-Session"] = sessionId;
	}
}

function preberiEHRBolnika() {
	sessionId = getSessionId();

	var ehrId = $("#preberiEHRid").val();

	if (!ehrId || ehrId.trim().length == 0) {
      toastr.warning("Prosim vnesite zahtevane podatke!");
      $("#rezultatMeritveVitalnihZnakov").html("");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
                
                console.log(party);
                
                $.ajaxSetup({
				    headers: {"Ehr-Session": sessionId}
				});
				var aql = "SELECT c/uid/value as uid, " +
				    "c/context/start_time as time, " +
				    "c/name/value as name " +
				    "FROM EHR[ehr_id/value = '" + ehrId + "'] CONTAINS COMPOSITION c " +
				    "ORDER BY c/context/start_time ASC";
				    
				
				$.ajax({
				    url: baseUrl + "/query?" + $.param({"aql": aql}),
				    type: 'GET',
				    success: function (res) {
						if(typeof(res) == "undefined"){
							toastr.warning("Pacient še nima vnešenih vitalnih znakov!");
							$("#rezultatMeritveVitalnihZnakov").html("");
							return;
						}
				        var rows = res.resultSet;
				        
				        console.log(res);
				        var uid = rows[rows.length-1].uid;
				        var parametriZahteve = {
						    format: 'STRUCTURED',
						};
				        $.ajax({
						    url: baseUrl + "/composition/" + uid+"?" + $.param(parametriZahteve),
						    type: 'GET',
						    //format: 'structured',
						    success: function (res) {
						    
						       console.log(res);
						       
						       var cas = res.composition.vital_signs.context[0].start_time[0];
						       var telesnaVisina = res.composition.vital_signs.height_length[0].any_event[0].body_height_length[0];
						       for (var key in telesnaVisina) {
									telesnaVisina = telesnaVisina[key];
									break;
								}
						       var telesnaTeza = res.composition.vital_signs.body_weight[0].any_event[0].body_weight[0];
						       for (var key in telesnaTeza) {
									telesnaTeza = telesnaTeza[key];
									break;
								}
						       var telesnaTemperatura = res.composition.vital_signs.body_temperature[0].any_event[0].temperature[0];
						       for (var key in telesnaTemperatura) {
									telesnaTemperatura = telesnaTemperatura[key];
									break;
								}
						       var sistolicniKrvniTlak = res.composition.vital_signs.blood_pressure[0].any_event[0].systolic[0];
						       for (var key in sistolicniKrvniTlak) {
									sistolicniKrvniTlak = sistolicniKrvniTlak[key];
									break;
								}
						       var diastolicniKrvniTlak = res.composition.vital_signs.blood_pressure[0].any_event[0].diastolic[0];
						       for (var key in diastolicniKrvniTlak) {
									diastolicniKrvniTlak = diastolicniKrvniTlak[key];
									break;
								}
						       var nasKrvi = res.composition.vital_signs.indirect_oximetry[0].spo2[0];
						       for (var key in nasKrvi) {
									nasKrvi = nasKrvi[key];
									break;
								}
						       //console.log(party.partyAdditionalInfo[0].value);
						       var base = party.partyAdditionalInfo;
						       var zdravilo = "";
						       for(var i = 0; i<base.length;i++){
						    		if(base[i].key == "zdravilo"){
						    			zdravilo = base[i].value;
						    		}
						       }
						       
						       console.log(zdravilo);
							   var results = "<br><table class='table table-striped table-hover'>"+
							    	"<tr><th>Datum in ura</th><td>"+cas+"</td></tr>"+
							    	"<tr><th>Telesna visina</th><td>"+telesnaVisina+" cm</td></tr>"+
							    	"<tr><th>Telesna teza</th><td>"+telesnaTeza+" kg</td></tr>"+
							    	"<tr><th>Telesna temperatura</th><td>"+telesnaTemperatura+" °C</td></tr>"+
							    	"<tr><th>Sistolični krvni tlak</th><td>"+sistolicniKrvniTlak+" mm Hg</td></tr>"+
							    	"<tr><th>Diastolični krvni tlak</th><td>"+diastolicniKrvniTlak+ "mm Hg</td></tr>"+
							    	"<tr><th>Nasičenost krvi s kisikom</th><td>"+nasKrvi+" %</td></tr>"+
							    	"<tr><th>Zdravila</th><td>"+zdravilo+"</td></tr>"+
							    	"</table>";
							    	$("#rezultatMeritveVitalnihZnakov").html(results);
						       
						    }
			             });
				    },
				    error: function(err) {
		                toastr.warning("Pacient še nima vnešenih vitalnih znakov!");
		                $("#rezultatMeritveVitalnihZnakov").html("");
				    }
				});
                
                
			},
			error: function(err) {
                toastr.error("Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
        	}
		});
		
	}
}

function vnesiVitalneZnake() {
	sessionId = getSessionId();

	var ehrId = $("#ehrIdBolnika").val();
	var datumInUra = $("#cas").val();
	var telesnaVisina = $("#telesnaVisina").val();
	var telesnaTeza = $("#telesnaTeza").val();
	var telesnaTemperatura = $("#telesnaTemperatura").val();
	var sistolicniKrvniTlak = $("#sisKrvniTlak").val();
	var diastolicniKrvniTlak = $("#diaKrvniTlak").val();
	var nasicenostKrviSKisikom = $("#nasKrvi").val();

	if (!ehrId || ehrId.trim().length == 0) {
      toastr.warning("Prosim vnesite zahtevane podatke!");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		    "ctx/time": datumInUra,
		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
		    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
		    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
		    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
		    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom,
		};
		var parametriZahteve = {
		    ehrId: ehrId,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
		};
		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
		        /*$("#dodajMeritveVitalnihZnakovSporocilo").html(
              "<span class='obvestilo label label-success fade-in'>" +
              res.meta.href + ".</span>");*/
              toastr.success(res.meta.href);
              
		    },
		    error: function(err) {
                toastr.error("Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}

function generiraj(){
	generirajPodatke(1);
    generirajPodatke(2);
    generirajPodatke(3);
}


$(document).ready(function () {
    /*if(window.location.href.indexOf("generiraj") > -1) {
        generirajPodatke(1);
        generirajPodatke(2);
        generirajPodatke(3);
    }*/
    
    $('#preberiObstojeciEHR').change(function() {
		$("#preberiEHRid").val($(this).val());
	});
	
	$('#zdravilaObstojeciEHR').change(function() {
		$("#zdravilaEHRid").val($(this).val());
	});
	
	$('#vitalniZnakiEhr').change(function() {
	    //$("#ehrIdBolnika").val($(this).val());
		var podatki = $(this).val().split("|");
		$("#ehrIdBolnika").val(podatki[0]);
		$("#cas").val(podatki[1]);
		$("#telesnaVisina").val(podatki[2]);
		$("#telesnaTeza").val(podatki[3]);
		$("#telesnaTemperatura").val(podatki[4]);
		$("#sisKrvniTlak").val(podatki[5]);
		$("#diaKrvniTlak").val(podatki[6]);
		$("#nasKrvi").val(podatki[7]);
	});
});
