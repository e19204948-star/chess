import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
  // COPIEZ VOS INFOS ICI
  apiKey: "426864123902",
  databaseURL: "https://chess-7eca6-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "chess-7eca6",
  // ...
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const gameRef = ref(db, 'games/partie1');

// Initialisation du jeu
var board = null;
var game = new Chess();

function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' 
    });

    if (move === null) return 'snapback';

    // Envoyer le coup à Firebase (Format FEN)
    set(gameRef, { fen: game.fen() });
}

// Écouter les changements sur Firebase
onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.fen !== game.fen()) {
        game.load(data.fen);
        board.position(data.fen);
    }
});

var config = {
    draggable: true,
    position: 'start',
    onDrop: onDrop
};
board = Chessboard('myBoard', config);
