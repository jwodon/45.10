// src/CardDraw.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CardDraw = () => {
    const [deckId, setDeckId] = useState(null);
    const [cards, setCards] = useState([]);
    const [remaining, setRemaining] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false);

    // Fetch a new deck when the component mounts
    useEffect(() => {
        const fetchDeck = async () => {
            const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
            setDeckId(response.data.deck_id);
            setRemaining(response.data.remaining);
        };
        fetchDeck();
    }, []);

    const drawCard = async () => {
        if (remaining === 0) {
            alert('Error: no cards remaining!');
            return;
        }

        const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        setCards([...cards, ...response.data.cards]);
        setRemaining(response.data.remaining);
    };

    const shuffleDeck = async () => {
        setIsShuffling(true);
        const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
        setDeckId(response.data.deck_id);
        setRemaining(response.data.remaining);
        setCards([]);
        setIsShuffling(false);
    };

    return (
        <div>
            <h1>Card Draw</h1>
            <button onClick={drawCard} disabled={isShuffling}>
                Draw a card
            </button>
            <button onClick={shuffleDeck} disabled={isShuffling}>
                Shuffle the deck
            </button>
            <div>
                {cards.map((card) => (
                    <img key={card.code} src={card.image} alt={`${card.value} of ${card.suit}`} />
                ))}
            </div>
            <p>Remaining cards: {remaining}</p>
        </div>
    );
};

export default CardDraw;
