function loginRobin() {
    $("#robinContent").show();
    $("#robinChallengeContent").hide();
    $.ajax({
        url: '/robinhood/auth/',
        type: 'get',
		beforeSend: function(xhr, settings) {
		    let token = localStorage.getItem('token');
		    if (token) {
		        xhr.setRequestHeader('Authorization','Bearer ' + token);
		    }
		},
        success: function(data) {
           if (data.success) {
               document.getElementById("robinStatus").innerHTML = "Account Active";
               if (data.token) {
                   localStorage.setItem('robin_token', data.token);
                   robinhoodLoadUI(data.token);
               }
           } else if (data.challenge) {
               document.querySelector("form[name='challenge'] input[name='challenge_id']").setAttribute('value', data.challenge.id);
               $("#robinContent").hide();
               $("#robinChallengeContent").show();
           } else {
               localStorage.removeItem('robin_token');
           }
        }
    });
}

function rhSubmitChallenge() {
    console.log("In rhSubmitChallenge");
    $.ajax({
        url: '/robinhood/challenge',
        type: 'post',
        data: {
            challenge_id: document.querySelector("form[name='challenge'] input[name='challenge_id']").value,
            challenge_code: document.querySelector("form[name='challenge'] input[name='challenge_code']").value
        },
		beforeSend: function(xhr, settings) {
		    let token = localStorage.getItem('token');
		    if (token) {
		        xhr.setRequestHeader('Authorization','Bearer ' + token);
		    }
		},
		success: function(data) {
           if (data.success) {
               document.getElementById("robinStatus").innerHTML = "Account Active";
               if (data.token) {
                   localStorage.setItem('robin_token', data.token);
                   robinhoodLoadUI(data.token);
               }
           } else if (data.challenge) {
               // Do nothing, we're already there
           } else {
               localStorage.removeItem('robin_token');
           }
        }
    });
}

function robinhoodLoadUI(token) {
    $("#robinContent").hide();
    $("#robinChallengeContent").hide();
    $("#robinData").show();
    $.ajax({
        url: '/robinhood/ui?robin_token=' + token,
        type: 'get',
		beforeSend: function(xhr, settings) {
		    let token = localStorage.getItem('token');
		    if (token) {
		        xhr.setRequestHeader('Authorization','Bearer ' + token);
		    }
		},
        success: function(data) {
           // console.log(data);
        }
    });
}

function robinhoodRenderUI(data) {
    
}

function rhPositions() {
    $.ajax({
        url: '/robinhood/positions',
        type: 'get',
		beforeSend: function(xhr, settings) {
		    let token = localStorage.getItem('token');
		    if (token) {
		        xhr.setRequestHeader('Authorization','Bearer ' + token);
		    }
		},
		success: function(data) {
           // console.log(data);
		}
	});
}
//Don't USE just call /robinhood/buy/
function rhBuy() {
    $.ajax({
        url: '/robinhood/buy',
        type: 'get',
		beforeSend: function(xhr, settings) {
		    let token = localStorage.getItem('token');
		    if (token) {
		        xhr.setRequestHeader('Authorization','Bearer ' + token);
		    }
		},
		success: function(data) {
           // console.log(data);
		}
	});
}

function rhSell() {
    $.ajax({
        url: '/robinhood/sell',
        type: 'get',
		beforeSend: function(xhr, settings) {
		    let token = localStorage.getItem('token');
		    if (token) {
		        xhr.setRequestHeader('Authorization','Bearer ' + token);
		    }
		},
		success: function(data) {
           // console.log(data);
		}
	});
}

function rhOrders() {
    $.ajax({
        url: '/robinhood/orders',
        type: 'get',
		beforeSend: function(xhr, settings) {
		    let token = localStorage.getItem('token');
		    if (token) {
		        xhr.setRequestHeader('Authorization','Bearer ' + token);
		    }
		},
		success: function(data) {
           // console.log(data);
		}
	});
}

function rhWatchlist() {
    $.ajax({
        url: '/robinhood/watchlist',
        type: 'get',
		beforeSend: function(xhr, settings) {
		    let token = localStorage.getItem('token');
		    if (token) {
		        xhr.setRequestHeader('Authorization','Bearer ' + token);
		    }
		},
		success: function(data) {
           // console.log(data);
		}
	});
}

function rhCancel() {
    $.ajax({
        url: '/robinhood/cancel',
        type: 'get',
		beforeSend: function(xhr, settings) {
		    let token = localStorage.getItem('token');
		    if (token) {
		        xhr.setRequestHeader('Authorization','Bearer ' + token);
		    }
		},
		success: function(data) {
           // console.log(data);
		}
	});
}