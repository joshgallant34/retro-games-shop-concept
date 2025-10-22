// List of games
const games = [
  {
    title: "Snake",
    img: "images/Snake.png",
    desc: "Classic Snake game. Eat the food and grow your snake!",
    link: "games/Snake.html"
  },
  {
    title: "Pong",
    img: "images/Pong.png",
    desc: "Retro Pong. Challenge yourself or a friend!",
    link: "games/Pong.html"
  },
  {
    title: "Breakout",
    img: "images/Breakout.png",
    desc: "Break bricks and reach the highest score!",
    link: "games/Breakout.html"
  }
];

// Populate the games grid
const gamesList = document.getElementById('games-list');

games.forEach(game => {
  const card = document.createElement('div');
  card.classList.add('game-card');
  card.innerHTML = `
    <img src="${game.img}" alt="${game.title}">
    <h3>${game.title}</h3>
    <p>${game.desc}</p>
    <a class="btn" href="${game.link}">Play</a>
  `;
  gamesList.appendChild(card);
});
