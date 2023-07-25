let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function createToyCard(toyObj) {
  const divCard = document.createElement('div');
  divCard.classList.add('card');
  const h2Name = document.createElement('h2');
  h2Name.textContent = toyObj.name
  const imgToy = document.createElement('img');
  imgToy.classList.add('toy-avatar');
  imgToy.src = toyObj.image;
  const pLikes = document.createElement('p');
  if (toyObj.likes <= 1) {
    pLikes.textContent = `${toyObj.likes} Like`;
  } else {
    pLikes.textContent = `${toyObj.likes} Likes`;
  }
  const btnLike = document.createElement('button');
  btnLike.classList.add('like-btn');
  btnLike.id = toyObj.id.toString();
  btnLike.textContent = 'Like ❤️';
  divCard.append(h2Name, imgToy, pLikes, btnLike);

  // add an event handler for like button.
  btnLike.addEventListener('click', e => {
    let numLikes = e.target.parentNode.children[2].textContent.slice(0,-5);
    numLikes = parseInt(numLikes, 10) + 1;

    fetch(`http://localhost:3000/toys/${e.target.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        'likes': numLikes,
      }),
    })
    .then(resp => resp.json())
    .then(toyObj => {
      if (toyObj.id <= 1) {
        e.target.parentNode.children[2].textContent = `${toyObj.likes} Like`;
      } else {
        e.target.parentNode.children[2].textContent = `${toyObj.likes} Likes`;
      }
    })
    .catch(error => console.log(error));
  });

  return divCard;
}

// Read all the cards
fetch('http://localhost:3000/toys')
.then(resp => resp.json())
.then(arrToys => {
  // console.log(arrToys);
  arrToys.forEach(toyObj => {
    const divToys = document.getElementById('toy-collection');
    divToys.appendChild(createToyCard(toyObj));
  });
})
.catch(error => console.log(error));

const frmAddToy = document.querySelector('form.add-toy-form');
frmAddToy.addEventListener('submit', e => {
  e.preventDefault();

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      'name': e.target.children[1].value,
      'image': e.target.children[3].value,
      'likes': 0,
    }),
  })
  .then(resp => resp.json())
  .then(toyObj => {
    document.getElementById('toy-collection').appendChild(createToyCard(toyObj));
  })
  .catch(error => console.log(error));

  e.target.reset();
});

// "name": "Jessie",
// "image": "https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
// "likes": 0

// fetch('http://localhost:3000/toys/9', {
//   method: 'DELETE',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'applicatioin/json',
//   }
// })
// .then(resp => resp.json())
// .then(data => console.log(data))
// .catch(error => console.log(error));


