testUser()
dataUser()
// setInterval(testUser, 1000);

function testUser(){
fetch('/welcome', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data.message);
    if (data.success) {
      $('#login-button').fadeOut("slow",function(){
      $("#container").fadeOut(function(){
        $("#admin-container").fadeIn();
        TweenMax.from("#admin-container", .4, { scale: 0, ease:Sine.easeInOut});
        TweenMax.to("#admin-container", .4, { scale: 1, ease:Sine.easeInOut});
        $("#start-container").fadeIn();
      })
    })}
  })
  .catch((error) => {
    console.error('Ошибка при выполнении GET-запроса:', error);
    // openPopupMessage("Нет доступа");
    TweenMax.from("admin-container", .4, { scale: 1, ease:Sine.easeInOut});
    TweenMax.to("admin-container", .4, { left:"0px", scale: 0, ease:Sine.easeInOut});
    $("#container, #forgotten-container , #admin-container").fadeOut(800, function(){
    $("#login-button").fadeIn(800);
  })
  });
}

$("#start-container,  #info-container, #edit-container").fadeOut()

function dataUser() {
  fetch('/data-user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data) {
      const dataContainer = document.getElementById('start-container-data');
      dataContainer.innerHTML = ''; 

      data.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('data-item');

        itemDiv.innerHTML = `<p>ID: ${item.id}</p>
                             <p>Mail: ${item.mail_user}</p>
                             <p>Role: ${item.role}</p>
                             <p>Date: ${item.date}</p>`;

        dataContainer.appendChild(itemDiv);
      });
    }
  })
  .catch((error) => {

      console.error('Ошибка при выполнении GET-запроса:', error);
    })
}


$("#startt").click(function(){
  $("#start-container, #info-container, #edit-container").fadeOut(function(){
    $("#start-container").fadeIn();
  });
  dataUser();
  testUser()
})

$('#info').click(function(){
  $("#start-container,  #info-container, #edit-contain").fadeOut(function(){
    $("#info-container").fadeIn();
  });
  testUser()
});

$('#edit').click(function(){
  $("#start-container,  #info-container, #edit-contain").fadeOut(function(){
    $("#edit-container").fadeIn();
  });
  testUser()
});

$('#login-button').click(function(){
  $('#login-button').fadeOut("slow",function(){
    $("#container").fadeIn();
    TweenMax.from("#container", .4, { scale: 0, ease:Sine.easeInOut});
    TweenMax.to("#container", .4, { scale: 1, ease:Sine.easeInOut});
  });
});

$(".close-btn").click(function(){
  TweenMax.from("#container", .4, { scale: 1, ease:Sine.easeInOut});
  TweenMax.to("#container", .4, { left:"0px", scale: 0, ease:Sine.easeInOut});
  $("#container, #forgotten-container ,#forgotten-container-ref, #admin-container").fadeOut(800, function(){
    $("#login-button").fadeIn(800);
  });
});


$(".close-btn-n").click(function(){
  TweenMax.from("forgotten-container-ref", .4, { scale: 1, ease:Sine.easeInOut});
  TweenMax.to("forgotten-container-ref", .4, { left:"0px", scale: 0, ease:Sine.easeInOut});
  $("#forgotten-container-ref").fadeOut(800, function(){
  });
});


$("#logaut").click(function(){
  fetch('/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      if (data.message ==="Not login") {
        TweenMax.from("#admin-container", .4, { scale: 1, ease:Sine.easeInOut});
        TweenMax.to("#admin-container", .4, { left:"0px", scale: 0, ease:Sine.easeInOut});
        $("#container, #forgotten-container ,#forgotten-container-ref, #admin-container").fadeOut(800, function(){
        $("#login-button").fadeIn(800);
        })};
      })
    .catch((error) => {
      console.error('Ошибка при выполнении GET-запроса:', error);
    })
});

$('#forgotten').click(function(){
  $("#container").fadeOut(function(){
    $("#forgotten-container").fadeIn();
  });
});

// window.location.href = 'welcome.html';
function openPopupMessage(text) {
  const popup = document.getElementById('forgotten-container-ref');
  const popupText = document.getElementById('popup-text');
  popupText.textContent = text;
  popup.style.display = 'block';
}

// Закрыть всплывающее сообщение
function closePopupMessage() {
  const popup = document.getElementById('forgotten-container-ref');
  popup.style.display = 'none';
}


$("#admin").click(function(){
  const email = $('input[name="email"]').val();
  const password = $('input[name="pass"]').val();
    fetch('/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        if (data.success) {
          // window.location.href = 'welcome';
          $("#container").fadeOut(function(){
            $("#admin-container").fadeIn();
            TweenMax.from("#admin-container", .4, { scale: 0, ease:Sine.easeInOut});
            TweenMax.to("#admin-container", .4, { scale: 1, ease:Sine.easeInOut});
            $("#start-container").fadeIn();
            testUser();
            dataUser();
        })}
        else {
          openPopupMessage(data.message);
        };
      })
      .catch((error) => {
        console.error('Ошибка при выполнении POST-запроса:', error);
      });
});

$("#register").click(function(){
  const email_r = $('input[name="email_r"]').val();
  const password_r = $('input[name="pass_r"]').val();
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email_r,
        password: password_r,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        if (data.success) {
          openPopupMessage(data.message);
        }
        else {
          openPopupMessage(data.message);
        };
      })
      .catch((error) => {
        console.error('Ошибка при выполнении POST-запроса:', error);
      });
});